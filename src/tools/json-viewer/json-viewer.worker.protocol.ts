import { exceedsUtf8ByteLimit, hasPlausibleUtf8ByteLength } from '@/utils/utf8';

export const JSON_LIVE_FORMAT_MAX_BYTES = 100_000;
export const JSON_MAX_INPUT_BYTES = 2 * 1024 * 1024;
export const JSON_MAX_OUTPUT_BYTES = 4 * 1024 * 1024;
export const JSON_MAX_DEPTH = 128;
export const JSON_MAX_NODES = 100_000;
export const JSON_FORMAT_DEBOUNCE_MS = 300;
export const JSON_TASK_TIMEOUT_MS = 5_000;

const JSON_MAX_ERROR_MESSAGE_CHARACTERS = 1_000;

export type JsonFormatMode = 'strict' | 'json5';

export type JsonTaskErrorCode =
  | 'validation'
  | 'syntax'
  | 'limit'
  | 'operation'
  | 'worker'
  | 'timeout'
  | 'cancelled'
  | 'unavailable';

export class JsonTaskError extends Error {
  override readonly name = 'JsonTaskError';

  constructor(
    public readonly code: JsonTaskErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}

export interface JsonFormatTask {
  operation: 'format'
  source: string
  indentSize: number
  sortKeys: boolean
  mode: JsonFormatMode
}

export interface JsonWorkerRequest {
  jobId: number
  task: JsonFormatTask
}

export interface JsonWorkerResultMessage {
  jobId: number
  type: 'result'
  operation: 'format'
  mode: JsonFormatMode
  value: string
  outputBytes: number
}

export interface JsonWorkerErrorMessage {
  jobId: number
  type: 'error'
  code: 'syntax' | 'limit' | 'operation'
  message: string
}

export type JsonWorkerMessage = JsonWorkerResultMessage | JsonWorkerErrorMessage;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isJsonFormatMode(value: unknown): value is JsonFormatMode {
  return value === 'strict' || value === 'json5';
}

export function parseJsonTask(value: unknown): JsonFormatTask {
  if (!isRecord(value) || value.operation !== 'format') {
    throw new JsonTaskError('validation', 'Invalid JSON formatting task.');
  }

  if (typeof value.source !== 'string') {
    throw new JsonTaskError('validation', 'Enter JSON to format.');
  }

  // Every UTF-16 code unit needs at least one UTF-8 byte. This O(1)
  // preflight rejects certainly oversized values without scanning a payload
  // that is about to be cloned. The worker performs the exact UTF-8 check.
  if (value.source.length > JSON_MAX_INPUT_BYTES) {
    throw new JsonTaskError(
      'limit',
      `JSON input is limited to ${JSON_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
    );
  }

  if (
    typeof value.indentSize !== 'number'
    || !Number.isSafeInteger(value.indentSize)
    || value.indentSize < 0
    || value.indentSize > 10
  ) {
    throw new JsonTaskError('validation', 'Indent size must be a whole number between 0 and 10.');
  }

  if (typeof value.sortKeys !== 'boolean') {
    throw new JsonTaskError('validation', 'Sort keys must be enabled or disabled explicitly.');
  }

  if (!isJsonFormatMode(value.mode)) {
    throw new JsonTaskError('validation', 'Select strict JSON or JSON5 compatibility mode.');
  }

  return {
    operation: 'format',
    source: value.source,
    indentSize: value.indentSize,
    sortKeys: value.sortKeys,
    mode: value.mode,
  };
}

export function parseJsonWorkerJobId(value: unknown): number {
  if (!isRecord(value) || typeof value.jobId !== 'number' || !Number.isSafeInteger(value.jobId) || value.jobId < 1) {
    throw new JsonTaskError('validation', 'Invalid JSON worker job identifier.');
  }

  return value.jobId;
}

export function parseJsonWorkerRequest(value: unknown): JsonWorkerRequest {
  const jobId = parseJsonWorkerJobId(value);
  if (!isRecord(value)) {
    throw new JsonTaskError('validation', 'Invalid JSON worker request.');
  }

  const task = parseJsonTask(value.task);
  if (exceedsUtf8ByteLimit(task.source, JSON_MAX_INPUT_BYTES)) {
    throw new JsonTaskError(
      'limit',
      `JSON input is limited to ${JSON_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
    );
  }

  return {
    jobId,
    task,
  };
}

export function parseJsonWorkerMessage(value: unknown): JsonWorkerMessage {
  if (!isRecord(value) || typeof value.jobId !== 'number' || !Number.isSafeInteger(value.jobId) || value.jobId < 1) {
    throw new JsonTaskError('worker', 'The JSON worker returned an invalid job identifier.');
  }

  const jobId = value.jobId;

  if (
    value.type === 'result'
    && value.operation === 'format'
    && isJsonFormatMode(value.mode)
    && typeof value.value === 'string'
    && hasPlausibleUtf8ByteLength(value.value, value.outputBytes, JSON_MAX_OUTPUT_BYTES)
  ) {
    return {
      jobId,
      type: 'result',
      operation: 'format',
      mode: value.mode,
      value: value.value,
      outputBytes: value.outputBytes,
    };
  }

  if (
    value.type === 'error'
    && (value.code === 'syntax' || value.code === 'limit' || value.code === 'operation')
    && typeof value.message === 'string'
    && value.message.length <= JSON_MAX_ERROR_MESSAGE_CHARACTERS
  ) {
    return { jobId, type: 'error', code: value.code, message: value.message };
  }

  throw new JsonTaskError('worker', 'The JSON worker returned an invalid message.');
}

export function toJsonTaskError(
  error: unknown,
  fallbackCode: JsonTaskErrorCode = 'operation',
): JsonTaskError {
  if (error instanceof JsonTaskError) {
    return error;
  }

  return new JsonTaskError(fallbackCode, 'JSON formatting failed. Please try again.');
}
