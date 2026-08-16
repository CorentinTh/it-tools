import { JSON_CODE_ERROR_MESSAGES, JSON_CODE_MAX_OUTPUT_BYTES, JSON_CODE_TIMEOUT_MS, parseJsonCodeTask } from './json-code-generator.worker.protocol';
import type { JsonCodeTask } from './json-code-generator.service';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createJsonCodeWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<JsonCodeTask>> = () => new Worker(
    new URL('./json-code-generator.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-json-code-generator' },
  ),
): BoundedTextWorkerClient<JsonCodeTask> {
  return new BoundedTextWorkerClient({
    errorMessages: JSON_CODE_ERROR_MESSAGES,
    maxOutputBytes: JSON_CODE_MAX_OUTPUT_BYTES,
    taskName: 'JSON code generation',
    timeoutMs: JSON_CODE_TIMEOUT_MS,
    validateTask: parseJsonCodeTask,
    workerFactory,
  });
}
