import {
  HASH_TEXT_ERROR_MESSAGES,
  HASH_TEXT_MAX_OUTPUT_BYTES,
  HASH_TEXT_TASK_TIMEOUT_MS,
  type HashTextTask,
  parseHashTextTask,
} from './hash-text.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

function createWorker(): WorkerTaskHandle<WorkerTaskRequest<HashTextTask>> {
  return new Worker(new URL('./hash-text.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-hash-text',
  });
}

export function createHashTextWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<HashTextTask>> = createWorker,
  timeoutMs = HASH_TEXT_TASK_TIMEOUT_MS,
): BoundedTextWorkerClient<HashTextTask> {
  return new BoundedTextWorkerClient({
    errorMessages: HASH_TEXT_ERROR_MESSAGES,
    maxOutputBytes: HASH_TEXT_MAX_OUTPUT_BYTES,
    taskName: 'text hashing',
    timeoutMs,
    validateTask: parseHashTextTask,
    workerFactory,
  });
}
