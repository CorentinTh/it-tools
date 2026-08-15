/// <reference lib="webworker" />

import JSON5 from 'json5';
import { CsvOutputLimitError, convertArrayToCsv } from './json-to-csv.service';
import {
  JSON_TO_CSV_ERROR_MESSAGES,
  type JsonToCsvTask,
  getJsonToCsvOutputLimit,
  parseJsonToCsvTask,
} from './json-to-csv.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';
import { isUnknownRecord } from '@/utils/worker-protocol';

interface JsonToCsvWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

function isObjectArray(value: unknown): value is Record<string, unknown>[] {
  return Array.isArray(value)
    && value.every(item => isUnknownRecord(item));
}

function convertJsonToCsv(task: JsonToCsvTask): { maxOutputBytes: number; value: string } {
  const inputBytes = new TextEncoder().encode(task.source).byteLength;
  const maxOutputBytes = getJsonToCsvOutputLimit(inputBytes);
  const parsed: unknown = JSON5.parse(task.source);
  if (!isObjectArray(parsed)) {
    throw new TypeError('Expected an array of objects.');
  }
  return {
    maxOutputBytes,
    value: convertArrayToCsv({ array: parsed, maxOutputBytes }),
  };
}

export function handleJsonToCsvWorkerRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseJsonToCsvTask);
    const converted = convertJsonToCsv(task);
    const result = createBoundedTextResult(converted.value, converted.maxOutputBytes);
    if (result === undefined) {
      throw new CsvOutputLimitError('CSV output exceeds its byte limit.');
    }
    return { jobId, type: 'result', result };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : error instanceof CsvOutputLimitError
        ? 'output-limit'
        : 'processing';
    return { jobId, type: 'error', code, message: JSON_TO_CSV_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as JsonToCsvWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleJsonToCsvWorkerRequest(event.data)));
