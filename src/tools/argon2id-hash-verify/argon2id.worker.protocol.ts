import {
  ARGON2ID_PHC_MAX_CHARACTERS,
  ARGON2ID_SALT_BYTES,
  type Argon2idParameters,
  parseArgon2idPhc,
  sameArgon2idParameters,
  validateArgon2idParameters,
  validateArgon2idPassword,
} from './argon2id.service';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const ARGON2ID_TIMEOUT_MS = 20_000;

export type Argon2idTask =
  | ({ operation: 'hash'; password: string; salt: Uint8Array } & Argon2idParameters)
  | { operation: 'verify'; password: string; phc: string };

export type Argon2idResult =
  | ({ operation: 'hash'; phc: string } & Argon2idParameters)
  | ({ operation: 'verify'; matches: boolean } & Argon2idParameters);

export type Argon2idWorkerErrorCode = 'validation' | 'input-limit' | 'format' | 'capability' | 'processing';
export type Argon2idTaskErrorCode = Argon2idWorkerErrorCode | 'worker' | 'timeout' | 'cancelled' | 'unavailable';

export type Argon2idWorkerMessage =
  | { jobId: number; type: 'result'; result: Argon2idResult }
  | { jobId: number; type: 'error'; code: Argon2idWorkerErrorCode; message: string };

export class Argon2idTaskError extends Error {
  override readonly name = 'Argon2idTaskError';
  constructor(public readonly code: Argon2idTaskErrorCode, message: string, public readonly elapsedMs = 0) {
    super(message);
  }
}

const ERROR_MESSAGES: Record<Argon2idWorkerErrorCode, string> = {
  'validation': 'Enter a password and valid bounded Argon2id parameters.',
  'input-limit': 'Password, PHC string, salt, or Argon2id parameters exceed the local safety limits.',
  'format': 'Enter one canonical Argon2id v=19 PHC string within the supported resource limits.',
  'capability': 'WebAssembly or secure browser cryptography is unavailable.',
  'processing': 'The local Argon2id operation failed.',
};

function exactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every(key => Object.prototype.hasOwnProperty.call(value, key));
}

function isUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array || Object.prototype.toString.call(value) === '[object Uint8Array]';
}

function mapValidationError(error: unknown, fallback: 'validation' | 'format'): Argon2idTaskError {
  if (error instanceof Argon2idTaskError) {
    return error;
  }
  return new Argon2idTaskError(error instanceof RangeError ? 'input-limit' : fallback, ERROR_MESSAGES[error instanceof RangeError ? 'input-limit' : fallback]);
}

export function parseArgon2idTask(value: unknown): Argon2idTask {
  if (!isUnknownRecord(value) || typeof value.operation !== 'string') {
    throw new Argon2idTaskError('validation', ERROR_MESSAGES.validation);
  }
  try {
    const password = validateArgon2idPassword(value.password);
    if (value.operation === 'hash' && exactKeys(value, ['operation', 'password', 'salt', 'memoryKiB', 'iterations', 'parallelism', 'hashLength'])) {
      if (!isUint8Array(value.salt) || value.salt.byteLength !== ARGON2ID_SALT_BYTES) {
        throw new RangeError('Invalid salt length.');
      }
      const parameters = validateArgon2idParameters(value);
      return { operation: 'hash', password, salt: new Uint8Array(value.salt), ...parameters };
    }
    if (value.operation === 'verify' && exactKeys(value, ['operation', 'password', 'phc']) && typeof value.phc === 'string') {
      parseArgon2idPhc(value.phc);
      return { operation: 'verify', password, phc: value.phc };
    }
  }
  catch (error) {
    throw mapValidationError(error, value.operation === 'verify' ? 'format' : 'validation');
  }
  throw new Argon2idTaskError('validation', ERROR_MESSAGES.validation);
}

export function parseArgon2idRequest(value: unknown): { jobId: number; task: Argon2idTask } {
  if (!isUnknownRecord(value) || !exactKeys(value, ['jobId', 'task']) || !isWorkerJobId(value.jobId)) {
    throw new Argon2idTaskError('validation', ERROR_MESSAGES.validation);
  }
  return { jobId: value.jobId, task: parseArgon2idTask(value.task) };
}

function parseResult(value: unknown): Argon2idResult | undefined {
  if (!isUnknownRecord(value) || typeof value.operation !== 'string') {
    return undefined;
  }
  try {
    if (value.operation === 'hash' && exactKeys(value, ['operation', 'phc', 'memoryKiB', 'iterations', 'parallelism', 'hashLength'])
      && typeof value.phc === 'string' && value.phc.length <= ARGON2ID_PHC_MAX_CHARACTERS) {
      const parsed = parseArgon2idPhc(value.phc);
      const parameters = validateArgon2idParameters(value);
      return sameArgon2idParameters(parsed, parameters) ? { operation: 'hash', phc: value.phc, ...parameters } : undefined;
    }
    if (value.operation === 'verify' && exactKeys(value, ['operation', 'matches', 'memoryKiB', 'iterations', 'parallelism', 'hashLength'])
      && typeof value.matches === 'boolean') {
      return { operation: 'verify', matches: value.matches, ...validateArgon2idParameters(value) };
    }
  }
  catch {
    return undefined;
  }
  return undefined;
}

export function parseArgon2idMessage(value: unknown): Argon2idWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new Argon2idTaskError('worker', 'The Argon2id worker returned an invalid message.');
  }
  if (value.type === 'result' && exactKeys(value, ['jobId', 'type', 'result'])) {
    const result = parseResult(value.result);
    if (result) {
      return { jobId: value.jobId, type: 'result', result };
    }
  }
  if (value.type === 'error' && exactKeys(value, ['jobId', 'type', 'code', 'message'])
    && typeof value.code === 'string' && value.code in ERROR_MESSAGES
    && value.message === ERROR_MESSAGES[value.code as Argon2idWorkerErrorCode]) {
    return { jobId: value.jobId, type: 'error', code: value.code as Argon2idWorkerErrorCode, message: value.message };
  }
  throw new Argon2idTaskError('worker', 'The Argon2id worker returned an invalid message.');
}

export function argon2idErrorMessage(code: Argon2idWorkerErrorCode): string {
  return ERROR_MESSAGES[code];
}
