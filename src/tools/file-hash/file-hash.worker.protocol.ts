import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const FILE_HASH_ALGORITHMS = [
  'SHA-256',
  'SHA-384',
  'SHA-512',
  'SHA3-256',
  'BLAKE3-256',
  'SHA-1',
  'MD5',
] as const;
export const FILE_HASH_LEGACY_ALGORITHMS = ['SHA-1', 'MD5'] as const;
export const FILE_HASH_MAX_FILE_BYTES = 8 * 1024 * 1024 * 1024;
export const FILE_HASH_MAX_FILE_LABEL = '8 GiB';
export const FILE_HASH_WINDOW_BYTES = 4 * 1024 * 1024;
export const FILE_HASH_TASK_TIMEOUT_MS = 60 * 60 * 1_000;
export const FILE_HASH_PROGRESS_INTERVAL_MS = 100;

export type FileHashAlgorithm = typeof FILE_HASH_ALGORITHMS[number];
export type FileHashWorkerErrorCode = 'validation' | 'unsupported' | 'read' | 'hash';
export type FileHashTaskErrorCode =
  | FileHashWorkerErrorCode
  | 'limit'
  | 'worker'
  | 'timeout'
  | 'cancelled'
  | 'unavailable';

export const FILE_HASH_WORKER_ERROR_MESSAGES: Readonly<Record<FileHashWorkerErrorCode, string>> = {
  validation: 'The file hash request is invalid.',
  unsupported: 'The requested hash algorithm is not supported.',
  read: 'The selected file could not be read.',
  hash: 'The selected file could not be hashed.',
};

export const FILE_HASH_DIGEST_BYTES: Readonly<Record<FileHashAlgorithm, number>> = {
  'MD5': 16,
  'SHA-1': 20,
  'SHA-256': 32,
  'SHA-384': 48,
  'SHA-512': 64,
  'SHA3-256': 32,
  'BLAKE3-256': 32,
};

const INVALID_WORKER_MESSAGE = 'The file hash worker returned an invalid message.';

export class FileHashTaskError extends Error {
  override readonly name = 'FileHashTaskError';

  constructor(
    public readonly code: FileHashTaskErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}

export interface FileHashTask {
  file: Blob
  algorithms: FileHashAlgorithm[]
}

export interface FileHashWorkerRequest {
  jobId: number
  task: FileHashTask
}

export interface FileHashProgress {
  bytesProcessed: number
  totalBytes: number
}

export interface FileHashDigest {
  algorithm: FileHashAlgorithm
  hex: string
}

export interface FileHashResult {
  fileSize: number
  digests: FileHashDigest[]
}

export type FileHashWorkerMessage =
  | { jobId: number; type: 'progress'; progress: FileHashProgress }
  | { jobId: number; type: 'result'; result: FileHashResult }
  | { jobId: number; type: 'error'; code: FileHashWorkerErrorCode; message: string };

export type FileHashWorkerTerminalMessage = Exclude<FileHashWorkerMessage, { type: 'progress' }>;

function isFileHashAlgorithm(value: unknown): value is FileHashAlgorithm {
  return typeof value === 'string'
    && (FILE_HASH_ALGORITHMS as readonly string[]).includes(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean {
  const actualKeys = Object.keys(value);
  return actualKeys.length === expectedKeys.length
    && expectedKeys.every(key => Object.prototype.hasOwnProperty.call(value, key));
}

function parseFileSize(file: Blob): number {
  let size: number;
  try {
    size = file.size;
  }
  catch {
    throw new FileHashTaskError('validation', 'Select a valid local file.');
  }

  if (!Number.isSafeInteger(size) || size < 0) {
    throw new FileHashTaskError('validation', 'Select a valid local file.');
  }
  if (size > FILE_HASH_MAX_FILE_BYTES) {
    throw new FileHashTaskError(
      'limit',
      `Files are limited to ${FILE_HASH_MAX_FILE_BYTES.toLocaleString('en')} bytes.`,
    );
  }

  return size;
}

export function parseFileHashTask(value: unknown): FileHashTask {
  if (
    !isUnknownRecord(value)
    || !hasExactKeys(value, ['file', 'algorithms'])
    || !(value.file instanceof Blob)
  ) {
    throw new FileHashTaskError('validation', 'Select a valid local file.');
  }

  parseFileSize(value.file);
  if (
    !Array.isArray(value.algorithms)
    || value.algorithms.length < 1
    || value.algorithms.length > FILE_HASH_ALGORITHMS.length
  ) {
    throw new FileHashTaskError(
      'validation',
      `Select between one and ${FILE_HASH_ALGORITHMS.length} hash algorithms.`,
    );
  }

  const algorithms: FileHashAlgorithm[] = [];
  let previousAlgorithmIndex = -1;
  for (const algorithm of value.algorithms) {
    if (!isFileHashAlgorithm(algorithm)) {
      throw new FileHashTaskError('unsupported', FILE_HASH_WORKER_ERROR_MESSAGES.unsupported);
    }
    const algorithmIndex = FILE_HASH_ALGORITHMS.indexOf(algorithm);
    if (algorithmIndex <= previousAlgorithmIndex) {
      throw new FileHashTaskError('validation', 'Select unique hash algorithms in canonical order.');
    }
    algorithms.push(algorithm);
    previousAlgorithmIndex = algorithmIndex;
  }

  return { file: value.file, algorithms };
}

export function parseFileHashWorkerJobId(
  value: unknown,
  errorCode: 'validation' | 'worker' = 'worker',
): number {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new FileHashTaskError(errorCode, 'The file hash worker job identifier is invalid.');
  }
  return value.jobId;
}

export function parseFileHashWorkerRequest(value: unknown): FileHashWorkerRequest {
  const jobId = parseFileHashWorkerJobId(value, 'validation');
  if (!isUnknownRecord(value) || !hasExactKeys(value, ['jobId', 'task'])) {
    throw new FileHashTaskError('validation', FILE_HASH_WORKER_ERROR_MESSAGES.validation);
  }
  return { jobId, task: parseFileHashTask(value.task) };
}

function parseFileHashProgress(value: unknown): FileHashProgress | undefined {
  if (
    !isUnknownRecord(value)
    || !hasExactKeys(value, ['bytesProcessed', 'totalBytes'])
    || typeof value.bytesProcessed !== 'number'
    || !Number.isSafeInteger(value.bytesProcessed)
    || value.bytesProcessed < 0
    || typeof value.totalBytes !== 'number'
    || !Number.isSafeInteger(value.totalBytes)
    || value.totalBytes < 0
    || value.totalBytes > FILE_HASH_MAX_FILE_BYTES
    || value.bytesProcessed > value.totalBytes
  ) {
    return undefined;
  }

  return {
    bytesProcessed: value.bytesProcessed,
    totalBytes: value.totalBytes,
  };
}

function parseFileHashResult(value: unknown): FileHashResult | undefined {
  if (
    !isUnknownRecord(value)
    || !hasExactKeys(value, ['fileSize', 'digests'])
    || typeof value.fileSize !== 'number'
    || !Number.isSafeInteger(value.fileSize)
    || value.fileSize < 0
    || value.fileSize > FILE_HASH_MAX_FILE_BYTES
    || !Array.isArray(value.digests)
    || value.digests.length < 1
    || value.digests.length > FILE_HASH_ALGORITHMS.length
  ) {
    return undefined;
  }

  const digests: FileHashDigest[] = [];
  let previousAlgorithmIndex = -1;
  for (const digest of value.digests) {
    if (
      !isUnknownRecord(digest)
      || !hasExactKeys(digest, ['algorithm', 'hex'])
      || !isFileHashAlgorithm(digest.algorithm)
      || typeof digest.hex !== 'string'
      || digest.hex.length !== FILE_HASH_DIGEST_BYTES[digest.algorithm] * 2
      || !/^[0-9a-f]+$/.test(digest.hex)
      || digests.some(({ algorithm }) => algorithm === digest.algorithm)
    ) {
      return undefined;
    }
    const algorithmIndex = FILE_HASH_ALGORITHMS.indexOf(digest.algorithm);
    if (algorithmIndex <= previousAlgorithmIndex) {
      return undefined;
    }
    digests.push({ algorithm: digest.algorithm, hex: digest.hex });
    previousAlgorithmIndex = algorithmIndex;
  }

  return { fileSize: value.fileSize, digests };
}

function isFileHashWorkerErrorCode(value: unknown): value is FileHashWorkerErrorCode {
  return value === 'validation' || value === 'unsupported' || value === 'read' || value === 'hash';
}

export function parseFileHashWorkerMessage(value: unknown): FileHashWorkerMessage {
  const jobId = parseFileHashWorkerJobId(value);
  if (!isUnknownRecord(value)) {
    throw new FileHashTaskError('worker', INVALID_WORKER_MESSAGE);
  }

  if (value.type === 'progress') {
    if (!hasExactKeys(value, ['jobId', 'type', 'progress'])) {
      throw new FileHashTaskError('worker', INVALID_WORKER_MESSAGE);
    }
    const progress = parseFileHashProgress(value.progress);
    if (progress !== undefined) {
      return { jobId, type: 'progress', progress };
    }
  }

  if (value.type === 'result') {
    if (!hasExactKeys(value, ['jobId', 'type', 'result'])) {
      throw new FileHashTaskError('worker', INVALID_WORKER_MESSAGE);
    }
    const result = parseFileHashResult(value.result);
    if (result !== undefined) {
      return { jobId, type: 'result', result };
    }
  }

  if (
    value.type === 'error'
    && hasExactKeys(value, ['jobId', 'type', 'code', 'message'])
    && isFileHashWorkerErrorCode(value.code)
    && value.message === FILE_HASH_WORKER_ERROR_MESSAGES[value.code]
  ) {
    return { jobId, type: 'error', code: value.code, message: value.message };
  }

  throw new FileHashTaskError('worker', INVALID_WORKER_MESSAGE);
}

export function resolveFileHashResult(
  result: FileHashResult,
  expectedTask: FileHashTask,
): FileHashResult {
  const expectedAlgorithms = new Set(expectedTask.algorithms);
  if (
    result.fileSize !== expectedTask.file.size
    || result.digests.length !== expectedAlgorithms.size
    || result.digests.some(({ algorithm }, index) => algorithm !== expectedTask.algorithms[index])
  ) {
    throw new FileHashTaskError('worker', 'The file hash worker returned a result for the wrong task.');
  }
  return result;
}

export function toFileHashTaskError(
  error: unknown,
  fallbackCode: FileHashTaskErrorCode = 'hash',
): FileHashTaskError {
  if (error instanceof FileHashTaskError) {
    return error;
  }
  return new FileHashTaskError(fallbackCode, 'File hashing failed. Please try again.');
}
