import type { DiffReport, Difference } from './json-diff.types';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const JSON_DIFF_MAX_INPUT_BYTES = 1024 * 1024;
export const JSON_DIFF_MAX_DEPTH = 128;
export const JSON_DIFF_MAX_INPUT_NODES = 100_000;
export const JSON_DIFF_MAX_OUTPUT_NODES = 100_000;
export const JSON_DIFF_MAX_LCS_CELLS = 250_000;
export const JSON_DIFF_TASK_TIMEOUT_MS = 8_000;

export type JsonDiffTaskErrorCode =
  | 'validation'
  | 'limit'
  | 'parse'
  | 'diff'
  | 'worker'
  | 'timeout'
  | 'cancelled'
  | 'unavailable';
export type JsonDiffWorkerErrorCode = 'validation' | 'limit' | 'parse' | 'diff';

export interface JsonDiffTask {
  alignArrays: boolean
  left: string
  onlyShowDifferences: boolean
  right: string
}

export interface JsonDiffWorkerRequest {
  jobId: number
  task: JsonDiffTask
}

export type JsonDiffWorkerMessage =
  | { jobId: number; type: 'result'; result: DiffReport }
  | { jobId: number; type: 'error'; code: JsonDiffWorkerErrorCode; message: string };

export const JSON_DIFF_ERROR_MESSAGES: Record<JsonDiffWorkerErrorCode, string> = {
  validation: 'Enter both JSON documents before comparing them.',
  limit: `Each JSON document is limited to ${JSON_DIFF_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes, ${JSON_DIFF_MAX_DEPTH} levels, and ${JSON_DIFF_MAX_INPUT_NODES.toLocaleString('en')} total nodes.`,
  parse: 'One or both documents are not valid JSON or JSON5.',
  diff: 'The JSON comparison could not be completed within its output complexity limits.',
};

export class JsonDiffTaskError extends Error {
  override readonly name = 'JsonDiffTaskError';

  constructor(
    public readonly code: JsonDiffTaskErrorCode,
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

export function parseJsonDiffTask(value: unknown): JsonDiffTask {
  if (
    !isUnknownRecord(value)
    || !hasExactKeys(value, ['alignArrays', 'left', 'onlyShowDifferences', 'right'])
    || typeof value.left !== 'string'
    || typeof value.right !== 'string'
    || typeof value.alignArrays !== 'boolean'
    || typeof value.onlyShowDifferences !== 'boolean'
    || value.left.trim() === ''
    || value.right.trim() === ''
  ) {
    throw new JsonDiffTaskError('validation', JSON_DIFF_ERROR_MESSAGES.validation);
  }

  if (
    exceedsUtf8ByteLimit(value.left, JSON_DIFF_MAX_INPUT_BYTES)
    || exceedsUtf8ByteLimit(value.right, JSON_DIFF_MAX_INPUT_BYTES)
  ) {
    throw new JsonDiffTaskError('limit', JSON_DIFF_ERROR_MESSAGES.limit);
  }

  return {
    alignArrays: value.alignArrays,
    left: value.left,
    onlyShowDifferences: value.onlyShowDifferences,
    right: value.right,
  };
}

export function parseJsonDiffWorkerJobId(value: unknown): number {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new JsonDiffTaskError('worker', 'The JSON diff worker returned an invalid job identifier.');
  }
  return value.jobId;
}

export function parseJsonDiffWorkerRequest(value: unknown): JsonDiffWorkerRequest {
  if (!isUnknownRecord(value) || !hasExactKeys(value, ['jobId', 'task'])) {
    throw new JsonDiffTaskError('validation', JSON_DIFF_ERROR_MESSAGES.validation);
  }
  return {
    jobId: parseJsonDiffWorkerJobId(value),
    task: parseJsonDiffTask(value.task),
  };
}

function isDifferenceRoot(value: unknown): value is Difference {
  return isUnknownRecord(value)
    && (value.type === 'object' || value.type === 'array' || value.type === 'value')
    && (typeof value.key === 'string' || typeof value.key === 'number')
    && Number.isSafeInteger(value.nodeCount)
    && Number(value.nodeCount) >= 1
    && Number(value.nodeCount) <= JSON_DIFF_MAX_OUTPUT_NODES
    && (
      value.status === 'added'
      || value.status === 'removed'
      || value.status === 'updated'
      || value.status === 'unchanged'
      || value.status === 'children-updated'
    )
    && (value.type === 'value' || Array.isArray(value.children));
}

function isDiffReport(value: unknown): value is DiffReport {
  if (
    !isUnknownRecord(value)
    || !hasExactKeys(value, ['alignments', 'difference', 'inputNodeCount', 'maxDepth', 'outputNodeCount'])
    || !isUnknownRecord(value.alignments)
  ) {
    return false;
  }
  const alignments = value.alignments;
  return hasExactKeys(alignments, ['index', 'key', 'lcs'])
    && isDifferenceRoot(value.difference)
    && Number.isSafeInteger(value.inputNodeCount)
    && Number(value.inputNodeCount) >= 2
    && Number(value.inputNodeCount) <= JSON_DIFF_MAX_INPUT_NODES
    && Number.isSafeInteger(value.outputNodeCount)
    && Number(value.outputNodeCount) >= 1
    && Number(value.outputNodeCount) <= JSON_DIFF_MAX_OUTPUT_NODES
    && Number.isSafeInteger(value.maxDepth)
    && Number(value.maxDepth) >= 0
    && Number(value.maxDepth) <= JSON_DIFF_MAX_DEPTH
    && ['index', 'key', 'lcs'].every(key => Number.isSafeInteger(alignments[key]) && Number(alignments[key]) >= 0);
}

export function parseJsonDiffWorkerMessage(value: unknown): JsonDiffWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new JsonDiffTaskError('worker', 'The JSON diff worker returned an invalid message.');
  }

  if (
    value.type === 'result'
    && hasExactKeys(value, ['jobId', 'result', 'type'])
    && isDiffReport(value.result)
  ) {
    return { jobId: value.jobId, type: 'result', result: value.result };
  }

  if (
    value.type === 'error'
    && hasExactKeys(value, ['code', 'jobId', 'message', 'type'])
    && (value.code === 'validation' || value.code === 'limit' || value.code === 'parse' || value.code === 'diff')
    && value.message === JSON_DIFF_ERROR_MESSAGES[value.code]
  ) {
    return { jobId: value.jobId, type: 'error', code: value.code, message: value.message };
  }

  throw new JsonDiffTaskError('worker', 'The JSON diff worker returned an invalid message.');
}

export function toJsonDiffTaskError(
  error: unknown,
  fallbackCode: JsonDiffTaskErrorCode = 'diff',
): JsonDiffTaskError {
  if (error instanceof JsonDiffTaskError) {
    return error;
  }
  return new JsonDiffTaskError(fallbackCode, JSON_DIFF_ERROR_MESSAGES.diff);
}
