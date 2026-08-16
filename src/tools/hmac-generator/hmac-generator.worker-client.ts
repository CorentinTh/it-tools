import type { HmacTask } from './hmac-generator.service';
import { HMAC_ERROR_MESSAGES, HMAC_MAX_OUTPUT_BYTES, HMAC_TIMEOUT_MS, parseHmacTask } from './hmac-generator.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createHmacWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<HmacTask>> = () => new Worker(
    new URL('./hmac-generator.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-hmac' },
  ),
): BoundedTextWorkerClient<HmacTask> {
  return new BoundedTextWorkerClient({
    errorMessages: HMAC_ERROR_MESSAGES,
    maxOutputBytes: HMAC_MAX_OUTPUT_BYTES,
    taskName: 'HMAC computation',
    timeoutMs: HMAC_TIMEOUT_MS,
    validateTask: parseHmacTask,
    workerFactory,
  });
}
