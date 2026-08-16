import { AES_ENVELOPE_MAX_BASE64_CHARACTERS, AES_ENVELOPE_MAX_BYTES, AES_ENVELOPE_MAX_FILE_BYTES, AES_ENVELOPE_MAX_TEXT_BYTES } from './aes-gcm-envelope.service';
import { exceedsUtf8ByteLimit, hasPlausibleUtf8ByteLength } from '@/utils/utf8';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const AES_ENVELOPE_TIMEOUT_MS = 30_000;

export type AesEnvelopeTask =
  | { operation: 'encrypt-text'; passphrase: string; text: string }
  | { operation: 'decrypt-text'; passphrase: string; base64: string }
  | { operation: 'encrypt-file'; passphrase: string; file: Blob; fileName: string; mimeType: string }
  | { operation: 'decrypt-file'; passphrase: string; file: Blob };

export type AesEnvelopeResult =
  | { kind: 'encrypted-text'; inputBytes: number; outputBytes: number; base64: string }
  | { kind: 'decrypted-text'; inputBytes: number; outputBytes: number; text: string }
  | { kind: 'encrypted-file'; inputBytes: number; outputBytes: number; output: ArrayBuffer }
  | { kind: 'decrypted-file'; inputBytes: number; outputBytes: number; fileName: string; mimeType: string; output: ArrayBuffer };

export type AesEnvelopeWorkerErrorCode = 'validation' | 'input-limit' | 'read' | 'format' | 'authentication' | 'crypto' | 'processing';
export type AesEnvelopeTaskErrorCode = AesEnvelopeWorkerErrorCode | 'worker' | 'timeout' | 'cancelled' | 'unavailable';

export type AesEnvelopeWorkerMessage =
  | { jobId: number; type: 'result'; result: AesEnvelopeResult }
  | { jobId: number; type: 'error'; code: AesEnvelopeWorkerErrorCode; message: string };

export class AesEnvelopeTaskError extends Error {
  override readonly name = 'AesEnvelopeTaskError';
  constructor(public readonly code: AesEnvelopeTaskErrorCode, message: string, public readonly elapsedMs = 0) {
    super(message);
  }
}

const ERROR_MESSAGES: Record<AesEnvelopeWorkerErrorCode, string> = {
  'validation': 'Enter one supported AES-GCM operation, a passphrase of at least 12 characters, and valid input.',
  'input-limit': 'Text is limited to 1 MiB, files to 32 MiB, and text-envelope Base64 to its bounded canonical size.',
  'read': 'The selected local file could not be read.',
  'format': 'The input is not a supported canonical ITAE v1 AES-GCM envelope for this operation.',
  'authentication': 'Authentication failed: the passphrase is wrong or the envelope was modified.',
  'crypto': 'Web Crypto AES-GCM or PBKDF2 is not available in this browser.',
  'processing': 'The AES-GCM envelope operation failed.',
};

function exactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every(key => Object.prototype.hasOwnProperty.call(value, key));
}

function validPassphrase(value: unknown): value is string {
  return typeof value === 'string' && Array.from(value).length >= 12 && !exceedsUtf8ByteLimit(value, 1024);
}

function validFileName(value: unknown): value is string {
  return typeof value === 'string' && Boolean(value) && !exceedsUtf8ByteLimit(value, 255)
    && ![...value].some((character) => {
      const code = character.charCodeAt(0);
      return code <= 0x1F || code === 0x7F || character === '/' || character === '\\';
    }) && value !== '.' && value !== '..';
}

function validMimeType(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 127 && (!value || /^[\x20-\x7E]+$/u.test(value));
}

export function parseAesEnvelopeTask(value: unknown): AesEnvelopeTask {
  if (!isUnknownRecord(value) || !validPassphrase(value.passphrase) || typeof value.operation !== 'string') {
    throw new AesEnvelopeTaskError('validation', ERROR_MESSAGES.validation);
  }
  if (value.operation === 'encrypt-text' && exactKeys(value, ['operation', 'passphrase', 'text']) && typeof value.text === 'string') {
    if (exceedsUtf8ByteLimit(value.text, AES_ENVELOPE_MAX_TEXT_BYTES)) {
      throw new AesEnvelopeTaskError('input-limit', ERROR_MESSAGES['input-limit']);
    }
    return { operation: value.operation, passphrase: value.passphrase, text: value.text };
  }
  if (value.operation === 'decrypt-text' && exactKeys(value, ['operation', 'passphrase', 'base64']) && typeof value.base64 === 'string') {
    if (value.base64.length > AES_ENVELOPE_MAX_BASE64_CHARACTERS) {
      throw new AesEnvelopeTaskError('input-limit', ERROR_MESSAGES['input-limit']);
    }
    return { operation: value.operation, passphrase: value.passphrase, base64: value.base64 };
  }
  if (value.operation === 'encrypt-file' && exactKeys(value, ['operation', 'passphrase', 'file', 'fileName', 'mimeType'])
    && value.file instanceof Blob && Number.isSafeInteger(value.file.size) && value.file.size >= 0
    && validFileName(value.fileName) && validMimeType(value.mimeType)) {
    if (value.file.size > AES_ENVELOPE_MAX_FILE_BYTES) {
      throw new AesEnvelopeTaskError('input-limit', ERROR_MESSAGES['input-limit']);
    }
    return { operation: value.operation, passphrase: value.passphrase, file: value.file, fileName: value.fileName, mimeType: value.mimeType };
  }
  if (value.operation === 'decrypt-file' && exactKeys(value, ['operation', 'passphrase', 'file'])
    && value.file instanceof Blob && Number.isSafeInteger(value.file.size) && value.file.size >= 60) {
    if (value.file.size > AES_ENVELOPE_MAX_BYTES) {
      throw new AesEnvelopeTaskError('input-limit', ERROR_MESSAGES['input-limit']);
    }
    return { operation: value.operation, passphrase: value.passphrase, file: value.file };
  }
  throw new AesEnvelopeTaskError('validation', ERROR_MESSAGES.validation);
}

export function parseAesEnvelopeRequest(value: unknown): { jobId: number; task: AesEnvelopeTask } {
  if (!isUnknownRecord(value) || !exactKeys(value, ['jobId', 'task']) || !isWorkerJobId(value.jobId)) {
    throw new AesEnvelopeTaskError('validation', ERROR_MESSAGES.validation);
  }
  return { jobId: value.jobId, task: parseAesEnvelopeTask(value.task) };
}

function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer
    || (Object.prototype.toString.call(value) === '[object ArrayBuffer]'
      && typeof (value as ArrayBuffer | undefined)?.byteLength === 'number');
}

function positiveBytes(value: unknown, maximum: number): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= maximum;
}

function parseResult(value: unknown): AesEnvelopeResult | undefined {
  if (!isUnknownRecord(value) || typeof value.kind !== 'string') {
    return undefined;
  }
  if (value.kind === 'encrypted-text' && exactKeys(value, ['kind', 'inputBytes', 'outputBytes', 'base64'])
    && positiveBytes(value.inputBytes, AES_ENVELOPE_MAX_TEXT_BYTES)
    && positiveBytes(value.outputBytes, AES_ENVELOPE_MAX_TEXT_BYTES + 1024)
    && value.outputBytes >= value.inputBytes && typeof value.base64 === 'string'
    && value.base64.length === Math.ceil(value.outputBytes / 3) * 4
    && /^[A-Za-z0-9+/]*={0,2}$/u.test(value.base64)) {
    return { kind: value.kind, inputBytes: value.inputBytes, outputBytes: value.outputBytes, base64: value.base64 };
  }
  if (value.kind === 'decrypted-text' && exactKeys(value, ['kind', 'inputBytes', 'outputBytes', 'text'])
    && positiveBytes(value.inputBytes, AES_ENVELOPE_MAX_TEXT_BYTES + 1024)
    && typeof value.text === 'string' && hasPlausibleUtf8ByteLength(value.text, value.outputBytes, AES_ENVELOPE_MAX_TEXT_BYTES)) {
    return { kind: value.kind, inputBytes: value.inputBytes, outputBytes: value.outputBytes, text: value.text };
  }
  if (value.kind === 'encrypted-file' && exactKeys(value, ['kind', 'inputBytes', 'outputBytes', 'output'])
    && positiveBytes(value.inputBytes, AES_ENVELOPE_MAX_FILE_BYTES)
    && positiveBytes(value.outputBytes, AES_ENVELOPE_MAX_BYTES) && value.outputBytes >= value.inputBytes
    && isArrayBuffer(value.output) && value.output.byteLength === value.outputBytes) {
    return { kind: value.kind, inputBytes: value.inputBytes, outputBytes: value.outputBytes, output: value.output };
  }
  if (value.kind === 'decrypted-file' && exactKeys(value, ['kind', 'inputBytes', 'outputBytes', 'fileName', 'mimeType', 'output'])
    && positiveBytes(value.inputBytes, AES_ENVELOPE_MAX_BYTES)
    && positiveBytes(value.outputBytes, AES_ENVELOPE_MAX_FILE_BYTES) && value.outputBytes <= value.inputBytes
    && validFileName(value.fileName) && validMimeType(value.mimeType)
    && isArrayBuffer(value.output) && value.output.byteLength === value.outputBytes) {
    return { kind: value.kind, inputBytes: value.inputBytes, outputBytes: value.outputBytes, fileName: value.fileName, mimeType: value.mimeType || 'application/octet-stream', output: value.output };
  }
  return undefined;
}

export function parseAesEnvelopeMessage(value: unknown): AesEnvelopeWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new AesEnvelopeTaskError('worker', 'The AES-GCM worker returned an invalid message.');
  }
  if (value.type === 'result' && exactKeys(value, ['jobId', 'type', 'result'])) {
    const result = parseResult(value.result);
    if (result) {
      return { jobId: value.jobId, type: 'result', result };
    }
  }
  if (value.type === 'error' && exactKeys(value, ['jobId', 'type', 'code', 'message'])
    && typeof value.code === 'string' && value.code in ERROR_MESSAGES
    && value.message === ERROR_MESSAGES[value.code as AesEnvelopeWorkerErrorCode]) {
    return { jobId: value.jobId, type: 'error', code: value.code as AesEnvelopeWorkerErrorCode, message: value.message };
  }
  throw new AesEnvelopeTaskError('worker', 'The AES-GCM worker returned an invalid message.');
}

export function aesEnvelopeErrorMessage(code: AesEnvelopeWorkerErrorCode): string {
  return ERROR_MESSAGES[code];
}
