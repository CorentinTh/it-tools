import { exceedsUtf8ByteLimit, hasPlausibleUtf8ByteLength } from '@/utils/utf8';

export const YAML_LIVE_FORMAT_MAX_BYTES = 100_000;
export const YAML_MAX_INPUT_BYTES = 2 * 1024 * 1024;
export const YAML_MAX_OUTPUT_BYTES = 4 * 1024 * 1024;
export const YAML_MAX_DEPTH = 128;
export const YAML_MAX_NODES = 100_000;
export const YAML_MAX_ALIAS_COUNT = 50;
export const YAML_FORMAT_DEBOUNCE_MS = 300;
export const YAML_TASK_TIMEOUT_MS = 5_000;

const YAML_MAX_ERROR_MESSAGE_CHARACTERS = 1_000;

export type YamlTaskErrorCode =
  | 'validation'
  | 'syntax'
  | 'limit'
  | 'operation'
  | 'worker'
  | 'timeout'
  | 'cancelled'
  | 'unavailable';

export class YamlTaskError extends Error {
  override readonly name = 'YamlTaskError';

  constructor(
    public readonly code: YamlTaskErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}

export interface YamlFormatTask {
  operation: 'format'
  source: string
  indentSize: number
  sortKeys: boolean
}

export interface YamlWorkerRequest {
  jobId: number
  task: YamlFormatTask
}

export interface YamlWorkerResultMessage {
  jobId: number
  type: 'result'
  operation: 'format'
  value: string
  outputBytes: number
}

export interface YamlWorkerErrorMessage {
  jobId: number
  type: 'error'
  code: 'syntax' | 'limit' | 'operation'
  message: string
}

export type YamlWorkerMessage = YamlWorkerResultMessage | YamlWorkerErrorMessage;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseYamlTask(value: unknown): YamlFormatTask {
  if (!isRecord(value) || value.operation !== 'format') {
    throw new YamlTaskError('validation', 'Invalid YAML formatting task.');
  }

  if (typeof value.source !== 'string') {
    throw new YamlTaskError('validation', 'Enter YAML to format.');
  }

  // Every UTF-16 code unit needs at least one UTF-8 byte. This O(1)
  // preflight rejects certainly oversized values without scanning a payload
  // that is about to be cloned. The worker performs the exact UTF-8 check.
  if (value.source.length > YAML_MAX_INPUT_BYTES) {
    throw new YamlTaskError(
      'limit',
      `YAML input is limited to ${YAML_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
    );
  }

  if (
    typeof value.indentSize !== 'number'
    || !Number.isSafeInteger(value.indentSize)
    || value.indentSize < 1
    || value.indentSize > 10
  ) {
    throw new YamlTaskError('validation', 'Indent size must be a whole number between 1 and 10.');
  }

  if (typeof value.sortKeys !== 'boolean') {
    throw new YamlTaskError('validation', 'Sort keys must be enabled or disabled explicitly.');
  }

  return {
    operation: 'format',
    source: value.source,
    indentSize: value.indentSize,
    sortKeys: value.sortKeys,
  };
}

export function parseYamlWorkerJobId(value: unknown): number {
  if (!isRecord(value) || typeof value.jobId !== 'number' || !Number.isSafeInteger(value.jobId) || value.jobId < 1) {
    throw new YamlTaskError('validation', 'Invalid YAML worker job identifier.');
  }

  return value.jobId;
}

export function parseYamlWorkerRequest(value: unknown): YamlWorkerRequest {
  const jobId = parseYamlWorkerJobId(value);
  if (!isRecord(value)) {
    throw new YamlTaskError('validation', 'Invalid YAML worker request.');
  }

  const task = parseYamlTask(value.task);
  if (exceedsUtf8ByteLimit(task.source, YAML_MAX_INPUT_BYTES)) {
    throw new YamlTaskError(
      'limit',
      `YAML input is limited to ${YAML_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
    );
  }

  return {
    jobId,
    task,
  };
}

export function parseYamlWorkerMessage(value: unknown): YamlWorkerMessage {
  if (!isRecord(value) || typeof value.jobId !== 'number' || !Number.isSafeInteger(value.jobId) || value.jobId < 1) {
    throw new YamlTaskError('worker', 'The YAML worker returned an invalid job identifier.');
  }

  const jobId = value.jobId;

  if (
    value.type === 'result'
    && value.operation === 'format'
    && typeof value.value === 'string'
    && hasPlausibleUtf8ByteLength(value.value, value.outputBytes, YAML_MAX_OUTPUT_BYTES)
  ) {
    return {
      jobId,
      type: 'result',
      operation: 'format',
      value: value.value,
      outputBytes: value.outputBytes,
    };
  }

  if (
    value.type === 'error'
    && (value.code === 'syntax' || value.code === 'limit' || value.code === 'operation')
    && typeof value.message === 'string'
    && value.message.length <= YAML_MAX_ERROR_MESSAGE_CHARACTERS
  ) {
    return { jobId, type: 'error', code: value.code, message: value.message };
  }

  throw new YamlTaskError('worker', 'The YAML worker returned an invalid message.');
}

export function toYamlTaskError(
  error: unknown,
  fallbackCode: YamlTaskErrorCode = 'operation',
): YamlTaskError {
  if (error instanceof YamlTaskError) {
    return error;
  }

  return new YamlTaskError(fallbackCode, 'YAML formatting failed. Please try again.');
}
