import { OUI_MAX_VENDOR_LENGTH } from './mac-address-lookup.data';

export const OUI_LOOKUP_TIMEOUT_MS = 10_000;
const MAX_WORKER_MESSAGE_LENGTH = 1_000;

export interface OuiLookupTask {
  operation: 'lookup'
  prefix: string
}

export interface OuiWorkerRequest {
  jobId: number
  task: OuiLookupTask
}

export type OuiWorkerErrorCode = 'validation' | 'operation';

export type OuiWorkerMessage =
  | { jobId: number; type: 'result'; operation: 'lookup'; value: string | null }
  | { jobId: number; type: 'error'; code: OuiWorkerErrorCode; message: string };

export type OuiLookupErrorCode = OuiWorkerErrorCode | 'worker' | 'timeout' | 'cancelled' | 'unavailable';

export class OuiLookupError extends Error {
  constructor(
    public readonly code: OuiLookupErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'OuiLookupError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJobId(value: unknown, errorCode: 'validation' | 'worker'): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) {
    throw new OuiLookupError(errorCode, 'The OUI worker job identifier is invalid.');
  }
  return value;
}

export function parseOuiLookupTask(value: unknown): OuiLookupTask {
  if (!isRecord(value) || value.operation !== 'lookup' || typeof value.prefix !== 'string') {
    throw new OuiLookupError('validation', 'The OUI lookup task is invalid.');
  }
  if (!/^[0-9A-F]{6}$/.test(value.prefix)) {
    throw new OuiLookupError('validation', 'The OUI prefix must contain exactly six upper-case hexadecimal characters.');
  }
  return { operation: 'lookup', prefix: value.prefix };
}

export function parseOuiWorkerRequest(value: unknown): OuiWorkerRequest {
  if (!isRecord(value)) {
    throw new OuiLookupError('validation', 'The OUI worker request is invalid.');
  }
  return {
    jobId: parseJobId(value.jobId, 'validation'),
    task: parseOuiLookupTask(value.task),
  };
}

export function parseOuiWorkerMessage(value: unknown): OuiWorkerMessage {
  if (!isRecord(value)) {
    throw new OuiLookupError('worker', 'The OUI worker returned an invalid message.');
  }

  const jobId = parseJobId(value.jobId, 'worker');
  if (value.type === 'result') {
    if (
      value.operation !== 'lookup'
      || (value.value !== null && (
        typeof value.value !== 'string'
        || value.value.length === 0
        || value.value.length > OUI_MAX_VENDOR_LENGTH
      ))
    ) {
      throw new OuiLookupError('worker', 'The OUI worker returned an invalid lookup result.');
    }
    return { jobId, type: 'result', operation: 'lookup', value: value.value };
  }

  if (value.type === 'error') {
    if (
      (value.code !== 'validation' && value.code !== 'operation')
      || typeof value.message !== 'string'
      || value.message.length === 0
      || value.message.length > MAX_WORKER_MESSAGE_LENGTH
    ) {
      throw new OuiLookupError('worker', 'The OUI worker returned an invalid error.');
    }
    return { jobId, type: 'error', code: value.code, message: value.message };
  }

  throw new OuiLookupError('worker', 'The OUI worker returned an unknown message type.');
}

export function toOuiLookupError(error: unknown, fallbackCode: OuiLookupErrorCode = 'operation'): OuiLookupError {
  if (error instanceof OuiLookupError) {
    return error;
  }
  return new OuiLookupError(fallbackCode, 'The local OUI lookup failed. Please try again.');
}
