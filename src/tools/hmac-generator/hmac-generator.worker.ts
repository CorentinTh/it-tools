/// <reference lib="webworker" />
import { computeHmac } from './hmac-generator.service';
import { HMAC_ERROR_MESSAGES, HMAC_MAX_OUTPUT_BYTES, parseHmacTask } from './hmac-generator.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleHmacRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseHmacTask);
    const result = createBoundedTextResult(computeHmac(task), HMAC_MAX_OUTPUT_BYTES);
    return result ? { jobId, type: 'result', result } : { jobId, type: 'error', code: 'output-limit', message: HMAC_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit') ? error.code : 'processing';
    return { jobId, type: 'error', code, message: HMAC_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', event => scope.postMessage(handleHmacRequest(event.data)));
