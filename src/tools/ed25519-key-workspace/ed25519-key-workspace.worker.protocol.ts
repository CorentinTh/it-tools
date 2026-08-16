import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const ED25519_TASK_TIMEOUT_MS = 30_000;
export const ED25519_MAX_COMMENT_CHARACTERS = 128;
export const ED25519_MAX_OUTPUT_CHARACTERS = 8_192;

export type Ed25519TaskErrorCode = 'validation' | 'generation' | 'worker' | 'timeout' | 'cancelled' | 'unavailable';
export type Ed25519WorkerErrorCode = 'validation' | 'generation' | 'unavailable';

export interface Ed25519KeyPair {
  publicKeyPem: string
  privateKeyPem: string
  openSshPublicKey: string
  fingerprint: string
}

export interface Ed25519GenerateTask { comment: string }
export interface Ed25519WorkerRequest { jobId: number; task: Ed25519GenerateTask }
export type Ed25519WorkerMessage =
  | { jobId: number; type: 'result'; result: Ed25519KeyPair }
  | { jobId: number; type: 'error'; code: Ed25519WorkerErrorCode; message: string };

export const ED25519_WORKER_ERROR_MESSAGES: Record<Ed25519WorkerErrorCode, string> = {
  validation: 'The SSH comment must be at most 128 printable characters.',
  generation: 'Ed25519 key generation failed. Please try again.',
  unavailable: 'This browser does not support Ed25519 with Web Crypto.',
};

export class Ed25519TaskError extends Error {
  override readonly name = 'Ed25519TaskError';

  constructor(
    public readonly code: Ed25519TaskErrorCode,
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

export function parseEd25519Comment(value: unknown): string {
  const hasControlCharacter = typeof value === 'string'
    && [...value].some((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint < 32 || codePoint === 127;
    });
  if (typeof value !== 'string' || value.length > ED25519_MAX_COMMENT_CHARACTERS || hasControlCharacter) {
    throw new Ed25519TaskError('validation', ED25519_WORKER_ERROR_MESSAGES.validation);
  }
  return value.trim();
}

export function parseEd25519Task(value: unknown): Ed25519GenerateTask {
  if (!isUnknownRecord(value) || !hasExactKeys(value, ['comment'])) {
    throw new Ed25519TaskError('validation', ED25519_WORKER_ERROR_MESSAGES.validation);
  }
  return { comment: parseEd25519Comment(value.comment) };
}

export function parseEd25519WorkerJobId(value: unknown): number {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new Ed25519TaskError('validation', 'Invalid Ed25519 worker job identifier.');
  }
  return value.jobId;
}

export function parseEd25519WorkerRequest(value: unknown): Ed25519WorkerRequest {
  if (!isUnknownRecord(value) || !hasExactKeys(value, ['jobId', 'task'])) {
    throw new Ed25519TaskError('validation', ED25519_WORKER_ERROR_MESSAGES.validation);
  }
  return { jobId: parseEd25519WorkerJobId(value), task: parseEd25519Task(value.task) };
}

function isBoundedString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= ED25519_MAX_OUTPUT_CHARACTERS;
}

export function parseEd25519WorkerMessage(value: unknown): Ed25519WorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new Ed25519TaskError('worker', 'The Ed25519 worker returned an invalid message.');
  }
  if (
    value.type === 'result'
    && hasExactKeys(value, ['jobId', 'type', 'result'])
    && isUnknownRecord(value.result)
    && hasExactKeys(value.result, ['publicKeyPem', 'privateKeyPem', 'openSshPublicKey', 'fingerprint'])
    && isBoundedString(value.result.publicKeyPem)
    && isBoundedString(value.result.privateKeyPem)
    && isBoundedString(value.result.openSshPublicKey)
    && isBoundedString(value.result.fingerprint)
    && value.result.publicKeyPem.startsWith('-----BEGIN PUBLIC KEY-----\n')
    && value.result.privateKeyPem.startsWith('-----BEGIN PRIVATE KEY-----\n')
    && value.result.openSshPublicKey.startsWith('ssh-ed25519 ')
    && value.result.fingerprint.startsWith('SHA256:')
  ) {
    return {
      jobId: value.jobId,
      type: 'result',
      result: {
        publicKeyPem: value.result.publicKeyPem,
        privateKeyPem: value.result.privateKeyPem,
        openSshPublicKey: value.result.openSshPublicKey,
        fingerprint: value.result.fingerprint,
      },
    };
  }
  if (
    value.type === 'error'
    && hasExactKeys(value, ['jobId', 'type', 'code', 'message'])
    && (value.code === 'validation' || value.code === 'generation' || value.code === 'unavailable')
    && value.message === ED25519_WORKER_ERROR_MESSAGES[value.code]
  ) {
    return { jobId: value.jobId, type: 'error', code: value.code, message: value.message };
  }
  throw new Ed25519TaskError('worker', 'The Ed25519 worker returned an invalid message.');
}

export function toEd25519TaskError(error: unknown, fallbackCode: Ed25519TaskErrorCode = 'generation'): Ed25519TaskError {
  return error instanceof Ed25519TaskError
    ? error
    : new Ed25519TaskError(fallbackCode, ED25519_WORKER_ERROR_MESSAGES.generation);
}
