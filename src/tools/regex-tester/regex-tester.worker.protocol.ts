import type { RegexMatchExecutionResult, RegexMatchResult } from './regex-tester.service';

export const REGEX_MAX_PATTERN_BYTES = 4 * 1024;
export const REGEX_MAX_INPUT_BYTES = 256 * 1024;
export const REGEX_MAX_MATCHES = 250;
export const REGEX_MAX_CAPTURES_PER_MATCH = 32;
export const REGEX_MAX_CAPTURE_ENTRIES = 2_000;
export const REGEX_MAX_RESULT_CHARACTERS = 256 * 1024;
export const REGEX_MAX_SAMPLE_CHARACTERS = 4 * 1024;
export const REGEX_MAX_SAMPLE_REPETITION = 32;
export const REGEX_MAX_DIAGRAM_PATTERN_BYTES = 1 * 1024;
export const REGEX_TASK_TIMEOUT_MS = 1_200;
export const REGEX_INPUT_DEBOUNCE_MS = 300;

export type RegexTaskErrorCode =
  | 'validation'
  | 'syntax'
  | 'limit'
  | 'operation'
  | 'worker'
  | 'timeout'
  | 'cancelled'
  | 'unavailable';

export class RegexTaskError extends Error {
  override readonly name = 'RegexTaskError';

  constructor(
    public readonly code: RegexTaskErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}

export interface RegexMatchTask {
  operation: 'match'
  pattern: string
  text: string
  flags: string
}

export interface RegexSampleTask {
  operation: 'sample'
  pattern: string
  flags: string
}

export type RegexTask = RegexMatchTask | RegexSampleTask;

export interface RegexWorkerRequest {
  jobId: number
  task: RegexTask
}

export interface RegexWorkerMatchResultMessage {
  jobId: number
  type: 'result'
  operation: 'match'
  value: RegexMatchExecutionResult
}

export interface RegexWorkerSampleResultMessage {
  jobId: number
  type: 'result'
  operation: 'sample'
  value: string
}

export interface RegexWorkerErrorMessage {
  jobId: number
  type: 'error'
  code: 'validation' | 'syntax' | 'limit' | 'operation'
  message: string
}

export type RegexWorkerMessage =
  | RegexWorkerMatchResultMessage
  | RegexWorkerSampleResultMessage
  | RegexWorkerErrorMessage;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getUtf8ByteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function parsePattern(value: unknown): string {
  if (typeof value !== 'string') {
    throw new RegexTaskError('validation', 'Enter a regular expression pattern.');
  }

  const byteLength = getUtf8ByteLength(value);
  if (byteLength > REGEX_MAX_PATTERN_BYTES) {
    throw new RegexTaskError(
      'limit',
      `Pattern is ${byteLength.toLocaleString()} UTF-8 bytes; the limit is ${REGEX_MAX_PATTERN_BYTES.toLocaleString()} bytes.`,
    );
  }

  return value;
}

function parseFlags(value: unknown): string {
  if (typeof value !== 'string' || !/^[dgimsuv]*$/.test(value)) {
    throw new RegexTaskError('validation', 'The selected regular expression flags are not supported.');
  }

  if (new Set(value).size !== value.length || (value.includes('u') && value.includes('v'))) {
    throw new RegexTaskError('validation', 'Regular expression flags must be unique, and u cannot be combined with v.');
  }

  return value;
}

function validateSyntax(pattern: string, flags: string): void {
  try {
    // Compilation is bounded by REGEX_MAX_PATTERN_BYTES. Execution happens only
    // inside a terminate-and-replace worker.
    RegExp(pattern, flags);
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid regular expression.';
    throw new RegexTaskError('syntax', message);
  }
}

export function parseRegexTask(value: unknown): RegexTask {
  if (!isRecord(value)) {
    throw new RegexTaskError('validation', 'Invalid regular expression task.');
  }

  const pattern = parsePattern(value.pattern);
  const flags = parseFlags(value.flags);
  validateSyntax(pattern, flags);

  if (value.operation === 'match') {
    if (typeof value.text !== 'string') {
      throw new RegexTaskError('validation', 'Enter text to match.');
    }

    const byteLength = getUtf8ByteLength(value.text);
    if (byteLength > REGEX_MAX_INPUT_BYTES) {
      throw new RegexTaskError(
        'limit',
        `Input is ${byteLength.toLocaleString()} UTF-8 bytes; the limit is ${REGEX_MAX_INPUT_BYTES.toLocaleString()} bytes.`,
      );
    }

    return { operation: 'match', pattern, text: value.text, flags };
  }

  if (value.operation === 'sample') {
    return { operation: 'sample', pattern, flags };
  }

  throw new RegexTaskError('validation', 'Unknown regular expression operation.');
}

export function parseRegexWorkerRequest(value: unknown): RegexWorkerRequest {
  if (!isRecord(value) || typeof value.jobId !== 'number' || !Number.isSafeInteger(value.jobId) || value.jobId < 1) {
    throw new RegexTaskError('validation', 'Invalid regular expression worker job identifier.');
  }

  return {
    jobId: value.jobId,
    task: parseRegexTask(value.task),
  };
}

function isOptionalString(value: unknown): value is string | undefined {
  return typeof value === 'string' || value === undefined;
}

function isOptionalIndex(value: unknown): value is number | undefined {
  return value === undefined || (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0);
}

function isCapture(value: unknown): boolean {
  return isRecord(value)
    && typeof value.name === 'string'
    && isOptionalString(value.value)
    && isOptionalIndex(value.start)
    && isOptionalIndex(value.end);
}

function isMatch(value: unknown): value is RegexMatchResult {
  return isRecord(value)
    && typeof value.index === 'number'
    && Number.isSafeInteger(value.index)
    && value.index >= 0
    && typeof value.value === 'string'
    && Array.isArray(value.captures)
    && value.captures.length <= REGEX_MAX_CAPTURES_PER_MATCH
    && value.captures.every(isCapture)
    && Array.isArray(value.groups)
    && value.groups.length <= REGEX_MAX_CAPTURES_PER_MATCH
    && value.groups.every(isCapture);
}

function parseMatchResult(value: unknown): RegexMatchExecutionResult {
  if (!isRecord(value) || !Array.isArray(value.matches) || typeof value.truncated !== 'boolean') {
    throw new RegexTaskError('worker', 'The regular expression worker returned invalid match metadata.');
  }

  if (value.matches.length > REGEX_MAX_MATCHES || !value.matches.every(isMatch)) {
    throw new RegexTaskError('worker', 'The regular expression worker returned invalid matches.');
  }

  const captureEntries = value.matches.reduce((total, match) => total + match.captures.length + match.groups.length, 0);
  const resultCharacters = value.matches.reduce((total, match) => {
    const captureCharacters = [...match.captures, ...match.groups]
      .reduce((captureTotal, capture) => captureTotal + capture.name.length + (capture.value?.length ?? 0), 0);
    return total + match.value.length + captureCharacters;
  }, 0);

  if (captureEntries > REGEX_MAX_CAPTURE_ENTRIES || resultCharacters > REGEX_MAX_RESULT_CHARACTERS) {
    throw new RegexTaskError('worker', 'The regular expression worker exceeded its output limits.');
  }

  return { matches: value.matches, truncated: value.truncated };
}

export function parseRegexWorkerMessage(value: unknown): RegexWorkerMessage {
  if (!isRecord(value) || typeof value.jobId !== 'number' || !Number.isSafeInteger(value.jobId) || value.jobId < 1) {
    throw new RegexTaskError('worker', 'The regular expression worker returned an invalid job identifier.');
  }

  const jobId = value.jobId;

  if (value.type === 'result' && value.operation === 'match') {
    return { jobId, type: 'result', operation: 'match', value: parseMatchResult(value.value) };
  }

  if (
    value.type === 'result'
    && value.operation === 'sample'
    && typeof value.value === 'string'
    && value.value.length <= REGEX_MAX_SAMPLE_CHARACTERS
  ) {
    return { jobId, type: 'result', operation: 'sample', value: value.value };
  }

  if (
    value.type === 'error'
    && (value.code === 'validation' || value.code === 'syntax' || value.code === 'limit' || value.code === 'operation')
    && typeof value.message === 'string'
    && value.message.length <= 1_000
  ) {
    return { jobId, type: 'error', code: value.code, message: value.message };
  }

  throw new RegexTaskError('worker', 'The regular expression worker returned an invalid message.');
}

export function toRegexTaskError(
  error: unknown,
  fallbackCode: RegexTaskErrorCode = 'operation',
): RegexTaskError {
  if (error instanceof RegexTaskError) {
    return error;
  }

  return new RegexTaskError(fallbackCode, 'The regular expression operation failed. Please try again.');
}
