/// <reference lib="webworker" />
import { compareLists } from './list-comparison.service';
import { LIST_COMPARISON_ERROR_MESSAGES, LIST_COMPARISON_MAX_OUTPUT_BYTES, parseListComparisonTask } from './list-comparison.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleListComparisonRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const request = parseBoundedTextWorkerRequest(value, parseListComparisonTask);
    const result = createBoundedTextResult(compareLists(request.task), LIST_COMPARISON_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: LIST_COMPARISON_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit') ? error.code : 'processing';
    return { jobId, type: 'error', code, message: LIST_COMPARISON_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', event => scope.postMessage(handleListComparisonRequest(event.data)));
