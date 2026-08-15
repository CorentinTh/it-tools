/// <reference lib="webworker" />

import { ListOutputLimitError, convert } from './list-converter.models';
import {
  LIST_CONVERTER_ERROR_MESSAGES,
  getListConverterOutputLimit,
  parseListConverterTask,
} from './list-converter.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface ListConverterWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleListConverterWorkerRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseListConverterTask);
    const inputBytes = new TextEncoder().encode(task.source).byteLength;
    const maxOutputBytes = getListConverterOutputLimit(inputBytes);
    const output = convert(task.source, task.options, maxOutputBytes);
    const result = createBoundedTextResult(output, maxOutputBytes);
    if (result === undefined) {
      throw new ListOutputLimitError('List output exceeds its byte limit.');
    }
    return { jobId, type: 'result', result };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : error instanceof ListOutputLimitError
        ? 'output-limit'
        : 'processing';
    return { jobId, type: 'error', code, message: LIST_CONVERTER_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as ListConverterWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleListConverterWorkerRequest(event.data)));
