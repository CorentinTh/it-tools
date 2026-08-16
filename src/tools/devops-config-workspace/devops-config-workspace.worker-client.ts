import type { DevopsConfigTask } from './devops-config-workspace.service';
import { DEVOPS_CONFIG_ERROR_MESSAGES, DEVOPS_CONFIG_MAX_OUTPUT_BYTES, DEVOPS_CONFIG_TIMEOUT_MS, parseDevopsConfigTask } from './devops-config-workspace.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createDevopsConfigWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<DevopsConfigTask>> = () => new Worker(
    new URL('./devops-config-workspace.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-devops-config' },
  ),
): BoundedTextWorkerClient<DevopsConfigTask> {
  return new BoundedTextWorkerClient({
    errorMessages: DEVOPS_CONFIG_ERROR_MESSAGES,
    maxOutputBytes: DEVOPS_CONFIG_MAX_OUTPUT_BYTES,
    taskName: 'DevOps configuration processing',
    timeoutMs: DEVOPS_CONFIG_TIMEOUT_MS,
    validateTask: parseDevopsConfigTask,
    workerFactory,
  });
}
