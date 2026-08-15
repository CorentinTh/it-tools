import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const RSA_KEY_SIZES = [2048, 3072, 4096] as const;
export const RSA_TASK_TIMEOUT_MS = 30_000;
export const RSA_MAX_PEM_CHARACTERS = 16_384;

export type RsaKeySize = typeof RSA_KEY_SIZES[number];
export type RsaTaskErrorCode =
  | 'validation'
  | 'generation'
  | 'worker'
  | 'timeout'
  | 'cancelled'
  | 'unavailable';
export type RsaWorkerErrorCode = 'validation' | 'generation';

export interface RsaKeyPair {
  bits: RsaKeySize
  publicKeyPem: string
  privateKeyPem: string
}

export interface RsaGenerateTask {
  bits: RsaKeySize
}

export interface RsaWorkerRequest {
  jobId: number
  task: RsaGenerateTask
}

export type RsaWorkerMessage =
  | { jobId: number; type: 'result'; result: RsaKeyPair }
  | { jobId: number; type: 'error'; code: RsaWorkerErrorCode; message: string };

export const RSA_WORKER_ERROR_MESSAGES: Record<RsaWorkerErrorCode, string> = {
  validation: 'Select a supported RSA key size.',
  generation: 'RSA key generation failed. Please try again.',
};

export class RsaTaskError extends Error {
  override readonly name = 'RsaTaskError';

  constructor(
    public readonly code: RsaTaskErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function isRsaKeySize(value: unknown): value is RsaKeySize {
  return value === 2048 || value === 3072 || value === 4096;
}

function isPem(value: unknown, label: 'PUBLIC KEY' | 'PRIVATE KEY'): value is string {
  if (typeof value !== 'string' || value.length < 1 || value.length > RSA_MAX_PEM_CHARACTERS) {
    return false;
  }

  const lines = value.trimEnd().split('\n');
  if (lines[0] !== `-----BEGIN ${label}-----` || lines.at(-1) !== `-----END ${label}-----`) {
    return false;
  }

  const payload = lines.slice(1, -1);
  return payload.length > 0
    && payload.every(line => line.length >= 1 && line.length <= 64 && /^[A-Za-z0-9+/]+={0,2}$/.test(line));
}

export function parseRsaKeySize(value: unknown): RsaKeySize {
  if (!isRsaKeySize(value)) {
    throw new RsaTaskError('validation', RSA_WORKER_ERROR_MESSAGES.validation);
  }
  return value;
}

export function parseRsaTask(value: unknown): RsaGenerateTask {
  if (!isUnknownRecord(value) || !hasExactKeys(value, ['bits'])) {
    throw new RsaTaskError('validation', RSA_WORKER_ERROR_MESSAGES.validation);
  }
  return { bits: parseRsaKeySize(value.bits) };
}

export function parseRsaWorkerJobId(value: unknown): number {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new RsaTaskError('validation', 'Invalid RSA worker job identifier.');
  }
  return value.jobId;
}

export function parseRsaWorkerRequest(value: unknown): RsaWorkerRequest {
  if (!isUnknownRecord(value) || !hasExactKeys(value, ['jobId', 'task'])) {
    throw new RsaTaskError('validation', RSA_WORKER_ERROR_MESSAGES.validation);
  }
  return {
    jobId: parseRsaWorkerJobId(value),
    task: parseRsaTask(value.task),
  };
}

export function parseRsaWorkerMessage(value: unknown): RsaWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new RsaTaskError('worker', 'The RSA worker returned an invalid message.');
  }

  if (
    value.type === 'result'
    && hasExactKeys(value, ['jobId', 'type', 'result'])
    && isUnknownRecord(value.result)
    && hasExactKeys(value.result, ['bits', 'publicKeyPem', 'privateKeyPem'])
    && isRsaKeySize(value.result.bits)
    && isPem(value.result.publicKeyPem, 'PUBLIC KEY')
    && isPem(value.result.privateKeyPem, 'PRIVATE KEY')
  ) {
    return {
      jobId: value.jobId,
      type: 'result',
      result: {
        bits: value.result.bits,
        publicKeyPem: value.result.publicKeyPem,
        privateKeyPem: value.result.privateKeyPem,
      },
    };
  }

  if (
    value.type === 'error'
    && hasExactKeys(value, ['jobId', 'type', 'code', 'message'])
    && (value.code === 'validation' || value.code === 'generation')
    && value.message === RSA_WORKER_ERROR_MESSAGES[value.code]
  ) {
    return {
      jobId: value.jobId,
      type: 'error',
      code: value.code,
      message: value.message,
    };
  }

  throw new RsaTaskError('worker', 'The RSA worker returned an invalid message.');
}

export function toRsaTaskError(
  error: unknown,
  fallbackCode: RsaTaskErrorCode = 'generation',
): RsaTaskError {
  if (error instanceof RsaTaskError) {
    return error;
  }
  return new RsaTaskError(fallbackCode, RSA_WORKER_ERROR_MESSAGES.generation);
}
