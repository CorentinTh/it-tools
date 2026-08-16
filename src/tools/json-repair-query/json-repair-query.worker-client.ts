import type { JsonWorkspaceTask } from './json-repair-query.service';
import { JSON_WORKSPACE_ERROR_MESSAGES, JSON_WORKSPACE_MAX_OUTPUT_BYTES, JSON_WORKSPACE_TIMEOUT_MS, parseJsonWorkspaceTask } from './json-repair-query.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createJsonWorkspaceWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<JsonWorkspaceTask>> = () => new Worker(
    new URL('./json-repair-query.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-json-repair-query' },
  ),
): BoundedTextWorkerClient<JsonWorkspaceTask> {
  return new BoundedTextWorkerClient({
    errorMessages: JSON_WORKSPACE_ERROR_MESSAGES,
    maxOutputBytes: JSON_WORKSPACE_MAX_OUTPUT_BYTES,
    taskName: 'JSON repair/query',
    timeoutMs: JSON_WORKSPACE_TIMEOUT_MS,
    validateTask: parseJsonWorkspaceTask,
    workerFactory,
  });
}
