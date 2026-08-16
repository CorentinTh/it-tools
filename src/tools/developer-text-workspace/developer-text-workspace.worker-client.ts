import type { DeveloperTextTask } from './developer-text-workspace.service';
import { DEVELOPER_TEXT_ERROR_MESSAGES, DEVELOPER_TEXT_MAX_OUTPUT_BYTES, DEVELOPER_TEXT_TIMEOUT_MS, parseDeveloperTextTask } from './developer-text-workspace.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createDeveloperTextWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<DeveloperTextTask>> = () => new Worker(
    new URL('./developer-text-workspace.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-developer-text-workspace' },
  ),
): BoundedTextWorkerClient<DeveloperTextTask> {
  return new BoundedTextWorkerClient({
    errorMessages: DEVELOPER_TEXT_ERROR_MESSAGES,
    maxOutputBytes: DEVELOPER_TEXT_MAX_OUTPUT_BYTES,
    taskName: 'Developer text transformation',
    timeoutMs: DEVELOPER_TEXT_TIMEOUT_MS,
    validateTask: parseDeveloperTextTask,
    workerFactory,
  });
}
