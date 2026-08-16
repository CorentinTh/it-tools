import type { SanitizerOptions } from './sensitive-data-masker.service';
import {
  SANITIZER_ERROR_MESSAGES,
  SANITIZER_MAX_OUTPUT_BYTES,
  SANITIZER_TASK_TIMEOUT_MS,
  parseSanitizerTask,
} from './sensitive-data-masker.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createSanitizerWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<SanitizerOptions>> = () => new Worker(
    new URL('./sensitive-data-masker.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-sensitive-data-masker' },
  ),
  timeoutMs = SANITIZER_TASK_TIMEOUT_MS,
): BoundedTextWorkerClient<SanitizerOptions> {
  return new BoundedTextWorkerClient({
    errorMessages: SANITIZER_ERROR_MESSAGES,
    maxOutputBytes: SANITIZER_MAX_OUTPUT_BYTES,
    taskName: 'sensitive-data sanitization',
    timeoutMs,
    validateTask: parseSanitizerTask,
    workerFactory,
  });
}
