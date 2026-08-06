export const BCRYPT_MIN_ROUNDS = 4;
export const BCRYPT_MAX_ROUNDS = 14;
export const BCRYPT_DEFAULT_ROUNDS = 10;
export const BCRYPT_MAX_PASSWORD_BYTES = 72;
export const BCRYPT_TASK_TIMEOUT_MS = 10_000;
export const BCRYPT_MAX_WORKER_ERROR_MESSAGE_LENGTH = 1_000;

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$(\d{2})\$[./A-Za-z0-9]{53}$/;
const DEFAULT_WORKER_ERROR_MESSAGE = 'The bcrypt operation failed. Please try again.';

export type BcryptTaskErrorCode = 'validation' | 'operation' | 'worker' | 'timeout' | 'cancelled' | 'unavailable';

export class BcryptTaskError extends Error {
  override readonly name = 'BcryptTaskError';

  constructor(
    public readonly code: BcryptTaskErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}

export interface BcryptHashTask {
  operation: 'hash'
  value: string
  rounds: number
}

export interface BcryptCompareTask {
  operation: 'compare'
  value: string
  hash: string
}

export type BcryptTask = BcryptHashTask | BcryptCompareTask;

export interface BcryptWorkerRequest {
  jobId: number
  task: BcryptTask
}

export interface BcryptWorkerProgressMessage {
  jobId: number
  type: 'progress'
  progress: number
}

export interface BcryptWorkerHashResultMessage {
  jobId: number
  type: 'result'
  operation: 'hash'
  value: string
}

export interface BcryptWorkerCompareResultMessage {
  jobId: number
  type: 'result'
  operation: 'compare'
  value: boolean
}

export interface BcryptWorkerErrorMessage {
  jobId: number
  type: 'error'
  code: 'validation' | 'operation'
  message: string
}

export type BcryptWorkerMessage =
  | BcryptWorkerProgressMessage
  | BcryptWorkerHashResultMessage
  | BcryptWorkerCompareResultMessage
  | BcryptWorkerErrorMessage;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getPasswordByteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function parsePassword(value: unknown): string {
  if (typeof value !== 'string') {
    throw new BcryptTaskError('validation', 'Enter a string to process.');
  }

  if (getPasswordByteLength(value) > BCRYPT_MAX_PASSWORD_BYTES) {
    throw new BcryptTaskError(
      'validation',
      `Bcrypt accepts at most ${BCRYPT_MAX_PASSWORD_BYTES} UTF-8 bytes. Shorten the string before continuing.`,
    );
  }

  return value;
}

function parseRounds(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new BcryptTaskError('validation', 'Salt rounds must be a whole number.');
  }

  const rounds = value;
  if (rounds < BCRYPT_MIN_ROUNDS || rounds > BCRYPT_MAX_ROUNDS) {
    throw new BcryptTaskError(
      'validation',
      `Salt rounds must be between ${BCRYPT_MIN_ROUNDS} and ${BCRYPT_MAX_ROUNDS}.`,
    );
  }

  return rounds;
}

function parseHash(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new BcryptTaskError('validation', 'Enter a bcrypt hash to compare.');
  }

  const match = BCRYPT_HASH_PATTERN.exec(value);
  if (!match) {
    throw new BcryptTaskError('validation', 'Enter a valid 60-character bcrypt hash.');
  }

  const rounds = Number(match[1]);
  if (rounds < BCRYPT_MIN_ROUNDS || rounds > BCRYPT_MAX_ROUNDS) {
    throw new BcryptTaskError(
      'validation',
      `For responsiveness, this tool compares hashes with ${BCRYPT_MIN_ROUNDS}–${BCRYPT_MAX_ROUNDS} rounds.`,
    );
  }

  return value;
}

function isSupportedBcryptHash(value: string): boolean {
  const match = BCRYPT_HASH_PATTERN.exec(value);
  if (!match) {
    return false;
  }

  const rounds = Number(match[1]);
  return rounds >= BCRYPT_MIN_ROUNDS && rounds <= BCRYPT_MAX_ROUNDS;
}

function parseJobId(value: unknown, errorCode: 'validation' | 'worker'): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) {
    throw new BcryptTaskError(errorCode, 'Invalid bcrypt worker job identifier.');
  }

  return value;
}

export function sanitizeBcryptWorkerErrorMessage(
  value: unknown,
  fallback = DEFAULT_WORKER_ERROR_MESSAGE,
): string {
  const sanitize = (message: string) => {
    let sanitized = '';
    for (const character of message) {
      if (sanitized.length + character.length > BCRYPT_MAX_WORKER_ERROR_MESSAGE_LENGTH) {
        break;
      }
      const code = character.codePointAt(0) ?? 0;
      const isUnsafeControl = code <= 0x1F
        || (code >= 0x7F && code <= 0x9F)
        || (code >= 0x202A && code <= 0x202E)
        || (code >= 0x2066 && code <= 0x2069);
      sanitized += isUnsafeControl ? ' ' : character;
    }
    return sanitized.trim();
  };
  const sanitized = typeof value === 'string' ? sanitize(value) : '';

  return sanitized || sanitize(fallback) || DEFAULT_WORKER_ERROR_MESSAGE;
}

export function parseBcryptTask(value: unknown): BcryptTask {
  if (!isRecord(value)) {
    throw new BcryptTaskError('validation', 'Invalid bcrypt task.');
  }

  if (value.operation === 'hash') {
    return {
      operation: 'hash',
      value: parsePassword(value.value),
      rounds: parseRounds(value.rounds),
    };
  }

  if (value.operation === 'compare') {
    return {
      operation: 'compare',
      value: parsePassword(value.value),
      hash: parseHash(value.hash),
    };
  }

  throw new BcryptTaskError('validation', 'Unknown bcrypt operation.');
}

export function parseBcryptWorkerRequest(value: unknown): BcryptWorkerRequest {
  if (!isRecord(value)) {
    throw new BcryptTaskError('validation', 'Invalid bcrypt worker job identifier.');
  }

  return {
    jobId: parseBcryptWorkerJobId(value),
    task: parseBcryptTask(value.task),
  };
}

export function parseBcryptWorkerJobId(value: unknown): number {
  if (!isRecord(value)) {
    throw new BcryptTaskError('validation', 'Invalid bcrypt worker job identifier.');
  }

  return parseJobId(value.jobId, 'validation');
}

export function parseBcryptWorkerMessage(value: unknown): BcryptWorkerMessage {
  if (!isRecord(value)) {
    throw new BcryptTaskError('worker', 'The bcrypt worker returned an invalid job identifier.');
  }

  const jobId = parseJobId(value.jobId, 'worker');
  if (value.type === 'progress') {
    if (typeof value.progress !== 'number' || !Number.isFinite(value.progress) || value.progress < 0 || value.progress > 1) {
      throw new BcryptTaskError('worker', 'The bcrypt worker returned invalid progress.');
    }

    return { jobId, type: 'progress', progress: value.progress };
  }

  if (
    value.type === 'result'
    && value.operation === 'hash'
    && typeof value.value === 'string'
    && isSupportedBcryptHash(value.value)
  ) {
    return { jobId, type: 'result', operation: 'hash', value: value.value };
  }

  if (value.type === 'result' && value.operation === 'compare' && typeof value.value === 'boolean') {
    return { jobId, type: 'result', operation: 'compare', value: value.value };
  }

  if (
    value.type === 'error'
    && (value.code === 'validation' || value.code === 'operation')
    && typeof value.message === 'string'
    && value.message.length > 0
    && value.message.length <= BCRYPT_MAX_WORKER_ERROR_MESSAGE_LENGTH
  ) {
    const message = sanitizeBcryptWorkerErrorMessage(value.message, '');
    if (message.length > 0) {
      return { jobId, type: 'error', code: value.code, message };
    }
  }

  throw new BcryptTaskError('worker', 'The bcrypt worker returned an invalid message.');
}

export function toBcryptTaskError(error: unknown, fallbackCode: BcryptTaskErrorCode = 'operation'): BcryptTaskError {
  if (error instanceof BcryptTaskError) {
    return error;
  }

  return new BcryptTaskError(fallbackCode, 'The bcrypt operation failed. Please try again.');
}
