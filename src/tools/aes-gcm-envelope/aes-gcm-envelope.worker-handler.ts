import {
  decodeAesEnvelopeBase64,
  decodeUtf8TextPayload,
  decryptAesEnvelope,
  encodeAesEnvelopeBase64,
  encryptAesEnvelope,
  utf8TextPayload,
} from './aes-gcm-envelope.service';
import {
  AesEnvelopeTaskError,
  type AesEnvelopeWorkerErrorCode,
  type AesEnvelopeWorkerMessage,
  aesEnvelopeErrorMessage,
  parseAesEnvelopeRequest,
} from './aes-gcm-envelope.worker.protocol';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

function transferable(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function readFile(file: Blob): Promise<Uint8Array> {
  try {
    return new Uint8Array(await file.arrayBuffer());
  }
  catch {
    throw new AesEnvelopeTaskError('read', aesEnvelopeErrorMessage('read'));
  }
}

function mapProcessingError(error: unknown): AesEnvelopeTaskError {
  if (error instanceof AesEnvelopeTaskError) {
    return error;
  }
  const message = error instanceof Error ? error.message : '';
  if (message.startsWith('Authentication failed:')) {
    return new AesEnvelopeTaskError('authentication', aesEnvelopeErrorMessage('authentication'));
  }
  if (/Web Crypto|AES-GCM|PBKDF2.*not available/u.test(message)) {
    return new AesEnvelopeTaskError('crypto', aesEnvelopeErrorMessage('crypto'));
  }
  if (error instanceof TypeError) {
    return new AesEnvelopeTaskError('format', aesEnvelopeErrorMessage('format'));
  }
  if (error instanceof RangeError) {
    return new AesEnvelopeTaskError('input-limit', aesEnvelopeErrorMessage('input-limit'));
  }
  return new AesEnvelopeTaskError('processing', aesEnvelopeErrorMessage('processing'));
}

export async function handleAesEnvelopeRequest(value: unknown): Promise<AesEnvelopeWorkerMessage> {
  let jobId = isUnknownRecord(value) && isWorkerJobId(value.jobId) ? value.jobId : 1;
  try {
    const request = parseAesEnvelopeRequest(value);
    jobId = request.jobId;
    const task = request.task;

    if (task.operation === 'encrypt-text') {
      const payload = utf8TextPayload(task.text);
      const envelope = await encryptAesEnvelope({ kind: 'text', payload }, task.passphrase);
      return { jobId, type: 'result', result: { kind: 'encrypted-text', inputBytes: payload.byteLength, outputBytes: envelope.byteLength, base64: encodeAesEnvelopeBase64(envelope) } };
    }
    if (task.operation === 'decrypt-text') {
      const envelope = decodeAesEnvelopeBase64(task.base64);
      const decrypted = await decryptAesEnvelope(envelope, task.passphrase);
      if (decrypted.kind !== 'text') {
        throw new AesEnvelopeTaskError('format', aesEnvelopeErrorMessage('format'));
      }
      return { jobId, type: 'result', result: { kind: 'decrypted-text', inputBytes: envelope.byteLength, outputBytes: decrypted.payload.byteLength, text: decodeUtf8TextPayload(decrypted.payload) } };
    }
    if (task.operation === 'encrypt-file') {
      const payload = await readFile(task.file);
      const envelope = await encryptAesEnvelope({ kind: 'file', payload, fileName: task.fileName, mimeType: task.mimeType }, task.passphrase);
      const output = transferable(envelope);
      return { jobId, type: 'result', result: { kind: 'encrypted-file', inputBytes: payload.byteLength, outputBytes: output.byteLength, output } };
    }

    const envelope = await readFile(task.file);
    const decrypted = await decryptAesEnvelope(envelope, task.passphrase);
    if (decrypted.kind !== 'file' || !decrypted.fileName) {
      throw new AesEnvelopeTaskError('format', aesEnvelopeErrorMessage('format'));
    }
    const output = transferable(decrypted.payload);
    return {
      jobId,
      type: 'result',
      result: {
        kind: 'decrypted-file',
        inputBytes: envelope.byteLength,
        outputBytes: output.byteLength,
        fileName: decrypted.fileName,
        mimeType: decrypted.mimeType || 'application/octet-stream',
        output,
      },
    };
  }
  catch (error) {
    const taskError = mapProcessingError(error);
    const code = ['validation', 'input-limit', 'read', 'format', 'authentication', 'crypto', 'processing'].includes(taskError.code)
      ? taskError.code as AesEnvelopeWorkerErrorCode
      : 'processing';
    return { jobId, type: 'error', code, message: aesEnvelopeErrorMessage(code) };
  }
}
