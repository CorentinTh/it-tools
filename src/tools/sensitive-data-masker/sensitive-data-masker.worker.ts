/// <reference lib="webworker" />

import { sanitizeSensitiveData } from './sensitive-data-masker.service';
import {
  SANITIZER_ERROR_MESSAGES,
  SANITIZER_MAX_OUTPUT_BYTES,
  parseSanitizerTask,
} from './sensitive-data-masker.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface SanitizerWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleSanitizerWorkerRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseSanitizerTask);
    const sanitized = sanitizeSensitiveData(task);
    const result = createBoundedTextResult(sanitized.output, SANITIZER_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: SANITIZER_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError
      && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: SANITIZER_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as SanitizerWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleSanitizerWorkerRequest(event.data)));
