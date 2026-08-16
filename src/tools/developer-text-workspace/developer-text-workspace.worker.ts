/// <reference lib="webworker" />
import { transformDeveloperText } from './developer-text-workspace.service';
import { DEVELOPER_TEXT_ERROR_MESSAGES, DEVELOPER_TEXT_MAX_OUTPUT_BYTES, parseDeveloperTextTask } from './developer-text-workspace.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleDeveloperTextRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const request = parseBoundedTextWorkerRequest(value, parseDeveloperTextTask);
    const result = createBoundedTextResult(transformDeveloperText(request.task), DEVELOPER_TEXT_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: DEVELOPER_TEXT_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: DEVELOPER_TEXT_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', event => scope.postMessage(handleDeveloperTextRequest(event.data)));
