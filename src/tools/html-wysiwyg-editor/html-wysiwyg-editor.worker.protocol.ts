import { exceedsUtf8ByteLimit, hasPlausibleUtf8ByteLength } from '@/utils/utf8';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const HTML_AUTO_FORMAT_MAX_BYTES = 64 * 1024;
export const HTML_FORMAT_MAX_BYTES = 1024 * 1024;
export const HTML_FORMAT_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const HTML_FORMAT_TASK_TIMEOUT_MS = 8_000;

export type HtmlFormatTaskErrorCode =
  | 'validation'
  | 'limit'
  | 'formatting'
  | 'worker'
  | 'timeout'
  | 'cancelled'
  | 'unavailable';
export type HtmlFormatWorkerErrorCode = 'validation' | 'limit' | 'formatting';

export interface HtmlFormatTask {
  html: string
}

export interface HtmlFormatResult {
  byteLength: number
  html: string
}

export interface HtmlFormatWorkerRequest {
  jobId: number
  task: HtmlFormatTask
}

export type HtmlFormatWorkerMessage =
  | { jobId: number; type: 'result'; result: HtmlFormatResult }
  | { jobId: number; type: 'error'; code: HtmlFormatWorkerErrorCode; message: string };

export const HTML_FORMAT_ERROR_MESSAGES: Record<HtmlFormatWorkerErrorCode, string> = {
  validation: 'Enter HTML to format.',
  limit: `HTML formatting is limited to ${HTML_FORMAT_MAX_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  formatting: 'HTML formatting failed. Check that the document is valid and try again.',
};

export class HtmlFormatTaskError extends Error {
  override readonly name = 'HtmlFormatTaskError';

  constructor(
    public readonly code: HtmlFormatTaskErrorCode,
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

export function parseHtmlFormatTask(value: unknown): HtmlFormatTask {
  if (!isUnknownRecord(value) || !hasExactKeys(value, ['html']) || typeof value.html !== 'string' || value.html === '') {
    throw new HtmlFormatTaskError('validation', HTML_FORMAT_ERROR_MESSAGES.validation);
  }

  if (exceedsUtf8ByteLimit(value.html, HTML_FORMAT_MAX_BYTES)) {
    throw new HtmlFormatTaskError('limit', HTML_FORMAT_ERROR_MESSAGES.limit);
  }

  return { html: value.html };
}

export function parseHtmlFormatWorkerJobId(value: unknown): number {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new HtmlFormatTaskError('worker', 'The HTML formatter worker returned an invalid job identifier.');
  }
  return value.jobId;
}

export function parseHtmlFormatWorkerRequest(value: unknown): HtmlFormatWorkerRequest {
  if (!isUnknownRecord(value) || !hasExactKeys(value, ['jobId', 'task'])) {
    throw new HtmlFormatTaskError('validation', HTML_FORMAT_ERROR_MESSAGES.validation);
  }
  return {
    jobId: parseHtmlFormatWorkerJobId(value),
    task: parseHtmlFormatTask(value.task),
  };
}

export function parseHtmlFormatWorkerMessage(value: unknown): HtmlFormatWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new HtmlFormatTaskError('worker', 'The HTML formatter worker returned an invalid message.');
  }

  if (
    value.type === 'result'
    && hasExactKeys(value, ['jobId', 'type', 'result'])
    && isUnknownRecord(value.result)
    && hasExactKeys(value.result, ['byteLength', 'html'])
    && typeof value.result.html === 'string'
    && value.result.html.length <= HTML_FORMAT_MAX_OUTPUT_BYTES
    && hasPlausibleUtf8ByteLength(
      value.result.html,
      value.result.byteLength,
      HTML_FORMAT_MAX_OUTPUT_BYTES,
    )
  ) {
    return {
      jobId: value.jobId,
      type: 'result',
      result: {
        byteLength: value.result.byteLength,
        html: value.result.html,
      },
    };
  }

  if (
    value.type === 'error'
    && hasExactKeys(value, ['jobId', 'type', 'code', 'message'])
    && (value.code === 'validation' || value.code === 'limit' || value.code === 'formatting')
    && value.message === HTML_FORMAT_ERROR_MESSAGES[value.code]
  ) {
    return {
      jobId: value.jobId,
      type: 'error',
      code: value.code,
      message: value.message,
    };
  }

  throw new HtmlFormatTaskError('worker', 'The HTML formatter worker returned an invalid message.');
}

export function toHtmlFormatTaskError(
  error: unknown,
  fallbackCode: HtmlFormatTaskErrorCode = 'formatting',
): HtmlFormatTaskError {
  if (error instanceof HtmlFormatTaskError) {
    return error;
  }
  return new HtmlFormatTaskError(fallbackCode, HTML_FORMAT_ERROR_MESSAGES.formatting);
}
