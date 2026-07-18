import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const JSON_SCHEMA_MAX_BYTES = 512 * 1024;
export const JSON_INSTANCE_MAX_BYTES = 2 * 1024 * 1024;
export const JSON_SCHEMA_MAX_NODES = 20_000;
export const JSON_INSTANCE_MAX_NODES = 100_000;
export const JSON_SCHEMA_MAX_DEPTH = 64;
export const JSON_INSTANCE_MAX_DEPTH = 128;
export const JSON_SCHEMA_ALL_ERRORS_MAX_INSTANCE_NODES = 10_000;
export const JSON_SCHEMA_MAX_ERRORS = 200;
export const JSON_SCHEMA_MAX_ERROR_CHARACTERS = 1_000;
export const JSON_SCHEMA_TASK_TIMEOUT_MS = 5_000;

export type JsonSchemaDraft = 'draft7' | 'draft2019' | 'draft2020';

export type JsonSchemaWarning =
  | 'format-not-validated'
  | 'ieee-754-numbers'
  | 'incomplete-error-list';

export type JsonSchemaTaskErrorCode =
  | 'validation'
  | 'syntax'
  | 'limit'
  | 'schema'
  | 'operation'
  | 'worker'
  | 'timeout'
  | 'cancelled'
  | 'unavailable';

export type JsonSchemaWorkerErrorCode =
  | 'syntax'
  | 'limit'
  | 'schema'
  | 'operation'
  | 'unavailable';

export class JsonSchemaTaskError extends Error {
  override readonly name = 'JsonSchemaTaskError';

  constructor(
    public readonly code: JsonSchemaTaskErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}

export interface JsonSchemaValidationTask {
  schemaSource: string
  instanceSource: string
  draft: JsonSchemaDraft
}

export interface JsonSchemaWorkerRequest {
  jobId: number
  task: JsonSchemaValidationTask
}

export interface JsonSchemaValidationError {
  instancePath: string
  schemaPath: string
  keyword: string
  message: string
  line: number
  column: number
}

export interface JsonSchemaValidationResult {
  valid: boolean
  completeErrorList: boolean
  warnings: JsonSchemaWarning[]
  errors: JsonSchemaValidationError[]
}

export interface JsonSchemaWorkerResultMessage {
  jobId: number
  type: 'result'
  result: JsonSchemaValidationResult
}

export interface JsonSchemaWorkerErrorMessage {
  jobId: number
  type: 'error'
  code: JsonSchemaWorkerErrorCode
  message: string
}

export type JsonSchemaWorkerMessage =
  | JsonSchemaWorkerResultMessage
  | JsonSchemaWorkerErrorMessage;

export function sanitizeJsonSchemaMessage(
  value: string,
  fallback: string,
  trim = true,
): string {
  let normalized = '';

  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    const unpairedSurrogate = codePoint >= 0xD800 && codePoint <= 0xDFFF;
    const unsafe = codePoint <= 0x1F
      || (codePoint >= 0x7F && codePoint <= 0x9F)
      || (codePoint >= 0x202A && codePoint <= 0x202E)
      || (codePoint >= 0x2066 && codePoint <= 0x2069);
    const next = unpairedSurrogate ? '\uFFFD' : unsafe ? ' ' : character;
    if (normalized.length + next.length > JSON_SCHEMA_MAX_ERROR_CHARACTERS) {
      break;
    }
    normalized += next;
  }

  const selected = trim ? normalized.trim() : normalized;
  return selected === '' ? fallback : selected;
}

function isJsonSchemaDraft(value: unknown): value is JsonSchemaDraft {
  return value === 'draft7' || value === 'draft2019' || value === 'draft2020';
}

function isJsonSchemaWarning(value: unknown): value is JsonSchemaWarning {
  return value === 'format-not-validated'
    || value === 'ieee-754-numbers'
    || value === 'incomplete-error-list';
}

function isJsonSchemaWorkerErrorCode(value: unknown): value is JsonSchemaWorkerErrorCode {
  return value === 'syntax'
    || value === 'limit'
    || value === 'schema'
    || value === 'operation'
    || value === 'unavailable';
}

function parseBoundedString(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length > JSON_SCHEMA_MAX_ERROR_CHARACTERS) {
    return undefined;
  }

  return sanitizeJsonSchemaMessage(value, '', false) === value ? value : undefined;
}

function parseValidationError(value: unknown): JsonSchemaValidationError | undefined {
  if (!isUnknownRecord(value)) {
    return undefined;
  }

  const instancePath = parseBoundedString(value.instancePath);
  const schemaPath = parseBoundedString(value.schemaPath);
  const keyword = parseBoundedString(value.keyword);
  const message = parseBoundedString(value.message);
  if (
    instancePath === undefined
    || schemaPath === undefined
    || keyword === undefined
    || message === undefined
    || !Number.isSafeInteger(value.line)
    || typeof value.line !== 'number'
    || value.line < 1
    || !Number.isSafeInteger(value.column)
    || typeof value.column !== 'number'
    || value.column < 1
  ) {
    return undefined;
  }

  return {
    instancePath,
    schemaPath,
    keyword,
    message,
    line: value.line,
    column: value.column,
  };
}

function parseValidationResult(value: unknown): JsonSchemaValidationResult | undefined {
  if (
    !isUnknownRecord(value)
    || typeof value.valid !== 'boolean'
    || typeof value.completeErrorList !== 'boolean'
    || !Array.isArray(value.warnings)
    || value.warnings.length > 3
    || !Array.isArray(value.errors)
    || value.errors.length > JSON_SCHEMA_MAX_ERRORS
  ) {
    return undefined;
  }

  const warnings = value.warnings.filter(isJsonSchemaWarning);
  if (warnings.length !== value.warnings.length || new Set(warnings).size !== warnings.length) {
    return undefined;
  }

  const errors = value.errors.map(parseValidationError);
  if (errors.includes(undefined)) {
    return undefined;
  }

  const parsedErrors = errors as JsonSchemaValidationError[];
  if ((value.valid && parsedErrors.length !== 0) || (!value.valid && parsedErrors.length === 0)) {
    return undefined;
  }

  return {
    valid: value.valid,
    completeErrorList: value.completeErrorList,
    warnings,
    errors: parsedErrors,
  };
}

export function parseJsonSchemaTask(value: unknown): JsonSchemaValidationTask {
  if (!isUnknownRecord(value)) {
    throw new JsonSchemaTaskError('validation', 'Invalid JSON Schema validation task.');
  }

  if (typeof value.schemaSource !== 'string' || value.schemaSource.length === 0) {
    throw new JsonSchemaTaskError('validation', 'Enter a JSON Schema to validate against.');
  }

  if (value.schemaSource.length > JSON_SCHEMA_MAX_BYTES) {
    throw new JsonSchemaTaskError(
      'limit',
      `JSON Schema input is limited to ${JSON_SCHEMA_MAX_BYTES.toLocaleString('en')} UTF-8 bytes.`,
    );
  }

  if (typeof value.instanceSource !== 'string' || value.instanceSource.length === 0) {
    throw new JsonSchemaTaskError('validation', 'Enter a JSON instance to validate.');
  }

  if (value.instanceSource.length > JSON_INSTANCE_MAX_BYTES) {
    throw new JsonSchemaTaskError(
      'limit',
      `JSON instance input is limited to ${JSON_INSTANCE_MAX_BYTES.toLocaleString('en')} UTF-8 bytes.`,
    );
  }

  if (!isJsonSchemaDraft(value.draft)) {
    throw new JsonSchemaTaskError('validation', 'Select a supported JSON Schema draft.');
  }

  return {
    schemaSource: value.schemaSource,
    instanceSource: value.instanceSource,
    draft: value.draft,
  };
}

export function parseJsonSchemaWorkerJobId(value: unknown): number {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new JsonSchemaTaskError('worker', 'The JSON Schema worker returned an invalid job identifier.');
  }

  return value.jobId;
}

export function parseJsonSchemaWorkerRequest(value: unknown): JsonSchemaWorkerRequest {
  const jobId = parseJsonSchemaWorkerJobId(value);
  if (!isUnknownRecord(value)) {
    throw new JsonSchemaTaskError('validation', 'Invalid JSON Schema worker request.');
  }

  const task = parseJsonSchemaTask(value.task);
  if (exceedsUtf8ByteLimit(task.schemaSource, JSON_SCHEMA_MAX_BYTES)) {
    throw new JsonSchemaTaskError(
      'limit',
      `JSON Schema input is limited to ${JSON_SCHEMA_MAX_BYTES.toLocaleString('en')} UTF-8 bytes.`,
    );
  }

  if (exceedsUtf8ByteLimit(task.instanceSource, JSON_INSTANCE_MAX_BYTES)) {
    throw new JsonSchemaTaskError(
      'limit',
      `JSON instance input is limited to ${JSON_INSTANCE_MAX_BYTES.toLocaleString('en')} UTF-8 bytes.`,
    );
  }

  return { jobId, task };
}

export function parseJsonSchemaWorkerMessage(value: unknown): JsonSchemaWorkerMessage {
  const jobId = parseJsonSchemaWorkerJobId(value);
  if (!isUnknownRecord(value)) {
    throw new JsonSchemaTaskError('worker', 'The JSON Schema worker returned an invalid message.');
  }

  if (value.type === 'result') {
    const result = parseValidationResult(value.result);
    if (result !== undefined) {
      return { jobId, type: 'result', result };
    }
  }

  if (
    value.type === 'error'
    && isJsonSchemaWorkerErrorCode(value.code)
  ) {
    const message = parseBoundedString(value.message);
    if (message !== undefined) {
      return { jobId, type: 'error', code: value.code, message };
    }
  }

  throw new JsonSchemaTaskError('worker', 'The JSON Schema worker returned an invalid message.');
}

export function toJsonSchemaTaskError(
  error: unknown,
  fallbackCode: JsonSchemaTaskErrorCode = 'operation',
): JsonSchemaTaskError {
  if (error instanceof JsonSchemaTaskError) {
    return error;
  }

  return new JsonSchemaTaskError(fallbackCode, 'JSON Schema validation failed. Please try again.');
}
