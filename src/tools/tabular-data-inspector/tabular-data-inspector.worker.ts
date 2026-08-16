/// <reference lib="webworker" />
import { processTabularData } from './tabular-data-inspector.service';
import { TABULAR_ERROR_MESSAGES, TABULAR_MAX_OUTPUT_BYTES, parseTabularDataTask } from './tabular-data-inspector.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleTabularDataRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const request = parseBoundedTextWorkerRequest(value, parseTabularDataTask);
    const result = createBoundedTextResult(processTabularData(request.task), TABULAR_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: TABULAR_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit') ? error.code : 'processing';
    return { jobId, type: 'error', code, message: TABULAR_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', event => scope.postMessage(handleTabularDataRequest(event.data)));
