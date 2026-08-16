/// <reference lib="webworker" />

import { MOCK_DATA_MAX_OUTPUT_BYTES, MockDataLimitError, generateMockData } from './mock-data-generator.service';
import {
  MOCK_DATA_ERROR_MESSAGES,
  parseMockDataTask,
} from './mock-data-generator.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface MockDataWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleMockDataWorkerRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseMockDataTask);
    const result = createBoundedTextResult(generateMockData(task), MOCK_DATA_MAX_OUTPUT_BYTES);
    if (!result) {
      throw new MockDataLimitError('Generated output exceeds its byte limit.');
    }
    return { jobId, type: 'result', result };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError
      ? error.code === 'input-limit' ? 'input-limit' : 'validation'
      : error instanceof MockDataLimitError ? 'output-limit' : 'processing';
    return { jobId, type: 'error', code, message: MOCK_DATA_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as MockDataWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleMockDataWorkerRequest(event.data)));
