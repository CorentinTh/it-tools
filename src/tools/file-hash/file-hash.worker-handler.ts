import { blake3 } from '@noble/hashes/blake3.js';
import { md5, sha1 } from '@noble/hashes/legacy.js';
import { sha256, sha384, sha512 } from '@noble/hashes/sha2.js';
import { sha3_256 } from '@noble/hashes/sha3.js';
import {
  FILE_HASH_DIGEST_BYTES,
  FILE_HASH_PROGRESS_INTERVAL_MS,
  FILE_HASH_WINDOW_BYTES,
  FILE_HASH_WORKER_ERROR_MESSAGES,
  type FileHashAlgorithm,
  type FileHashDigest,
  type FileHashProgress,
  FileHashTaskError,
  type FileHashWorkerErrorCode,
  type FileHashWorkerMessage,
  type FileHashWorkerTerminalMessage,
  parseFileHashWorkerJobId,
  parseFileHashWorkerRequest,
  toFileHashTaskError,
} from './file-hash.worker.protocol';

export interface FileHashIncrementalHasher {
  update: (bytes: Uint8Array) => unknown
  digest: () => Uint8Array
  destroy: () => void
}

export interface FileHashWorkerHandlerOptions {
  windowBytes?: number
  now?: () => number
  emitProgress?: (message: Extract<FileHashWorkerMessage, { type: 'progress' }>) => void
  createHasher?: (algorithm: FileHashAlgorithm) => FileHashIncrementalHasher
}

function createHasher(algorithm: FileHashAlgorithm): FileHashIncrementalHasher {
  switch (algorithm) {
    case 'MD5':
      return md5.create();
    case 'SHA-1':
      return sha1.create();
    case 'SHA-256':
      return sha256.create();
    case 'SHA-384':
      return sha384.create();
    case 'SHA-512':
      return sha512.create();
    case 'SHA3-256':
      return sha3_256.create();
    case 'BLAKE3-256':
      return blake3.create();
  }
}

function bytesToLowerHex(bytes: Uint8Array): string {
  let hex = '';
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
}

function errorMessage(
  jobId: number,
  code: FileHashWorkerErrorCode,
): FileHashWorkerTerminalMessage {
  return {
    jobId,
    type: 'error',
    code,
    message: FILE_HASH_WORKER_ERROR_MESSAGES[code],
  };
}

function workerErrorCode(error: unknown): FileHashWorkerErrorCode {
  const taskError = toFileHashTaskError(error);
  if (taskError.code === 'unsupported' || taskError.code === 'read' || taskError.code === 'hash') {
    return taskError.code;
  }
  return 'validation';
}

function destroyHashers(hashers: FileHashIncrementalHasher[]): void {
  for (const hasher of hashers) {
    try {
      hasher.destroy();
    }
    catch {
      // Cleanup must not replace the static worker result.
    }
  }
}

function validateWindowBytes(value: number): number {
  if (!Number.isSafeInteger(value) || value < 1 || value > FILE_HASH_WINDOW_BYTES) {
    throw new FileHashTaskError('hash', FILE_HASH_WORKER_ERROR_MESSAGES.hash);
  }
  return value;
}

export async function handleFileHashWorkerRequest(
  value: unknown,
  options: FileHashWorkerHandlerOptions = {},
): Promise<FileHashWorkerTerminalMessage> {
  let jobId = 1;
  try {
    jobId = parseFileHashWorkerJobId(value, 'validation');
  }
  catch {
    return errorMessage(jobId, 'validation');
  }

  let request;
  try {
    request = parseFileHashWorkerRequest(value);
  }
  catch (error) {
    return errorMessage(jobId, workerErrorCode(error));
  }

  const hashers: Array<{ algorithm: FileHashAlgorithm; hasher: FileHashIncrementalHasher }> = [];
  try {
    const windowBytes = validateWindowBytes(options.windowBytes ?? FILE_HASH_WINDOW_BYTES);
    const now = options.now ?? (() => globalThis.performance.now());
    const emitProgress = (progress: FileHashProgress) => options.emitProgress?.({
      jobId,
      type: 'progress',
      progress,
    });
    const fileSize = request.task.file.size;

    for (const algorithm of request.task.algorithms) {
      hashers.push({
        algorithm,
        hasher: (options.createHasher ?? createHasher)(algorithm),
      });
    }

    let bytesProcessed = 0;
    emitProgress({ bytesProcessed, totalBytes: fileSize });
    let lastProgressAt = now();

    while (bytesProcessed < fileSize) {
      const end = Math.min(bytesProcessed + windowBytes, fileSize);
      let buffer: ArrayBuffer;
      try {
        const window = request.task.file.slice(bytesProcessed, end);
        buffer = await window.arrayBuffer();
        if (!(buffer instanceof ArrayBuffer) || buffer.byteLength !== end - bytesProcessed) {
          throw new Error('The Blob window returned an unexpected byte length.');
        }
      }
      catch {
        throw new FileHashTaskError('read', FILE_HASH_WORKER_ERROR_MESSAGES.read);
      }

      try {
        const bytes = new Uint8Array(buffer);
        for (const { hasher } of hashers) {
          hasher.update(bytes);
        }
      }
      catch {
        throw new FileHashTaskError('hash', FILE_HASH_WORKER_ERROR_MESSAGES.hash);
      }

      bytesProcessed = end;
      if (bytesProcessed < fileSize) {
        const currentTime = now();
        if (currentTime - lastProgressAt >= FILE_HASH_PROGRESS_INTERVAL_MS) {
          emitProgress({ bytesProcessed, totalBytes: fileSize });
          lastProgressAt = currentTime;
        }
      }
    }

    if (bytesProcessed !== fileSize) {
      throw new FileHashTaskError('read', FILE_HASH_WORKER_ERROR_MESSAGES.read);
    }

    const digests: FileHashDigest[] = [];
    try {
      for (const { algorithm, hasher } of hashers) {
        const digest = hasher.digest();
        const expectedBytes = FILE_HASH_DIGEST_BYTES[algorithm];
        if (!(digest instanceof Uint8Array) || digest.byteLength !== expectedBytes) {
          throw new Error('The hash implementation returned an invalid digest.');
        }
        digests.push({ algorithm, hex: bytesToLowerHex(digest) });
      }
    }
    catch {
      throw new FileHashTaskError('hash', FILE_HASH_WORKER_ERROR_MESSAGES.hash);
    }

    emitProgress({ bytesProcessed, totalBytes: fileSize });
    return {
      jobId,
      type: 'result',
      result: { fileSize, digests },
    };
  }
  catch (error) {
    return errorMessage(jobId, workerErrorCode(error));
  }
  finally {
    destroyHashers(hashers.map(({ hasher }) => hasher));
  }
}
