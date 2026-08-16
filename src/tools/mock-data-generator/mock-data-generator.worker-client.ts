import { MOCK_DATA_MAX_OUTPUT_BYTES, type MockDataOptions } from './mock-data-generator.service';
import {
  MOCK_DATA_ERROR_MESSAGES,
  MOCK_DATA_TASK_TIMEOUT_MS,
  parseMockDataTask,
} from './mock-data-generator.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createMockDataWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<MockDataOptions>> = () => new Worker(
    new URL('./mock-data-generator.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-mock-data' },
  ),
  timeoutMs = MOCK_DATA_TASK_TIMEOUT_MS,
): BoundedTextWorkerClient<MockDataOptions> {
  return new BoundedTextWorkerClient({
    errorMessages: MOCK_DATA_ERROR_MESSAGES,
    maxOutputBytes: MOCK_DATA_MAX_OUTPUT_BYTES,
    taskName: 'mock-data generation',
    timeoutMs,
    validateTask: parseMockDataTask,
    workerFactory,
  });
}
