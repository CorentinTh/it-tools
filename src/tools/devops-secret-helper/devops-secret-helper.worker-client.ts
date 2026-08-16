import type { DevopsSecretTask } from './devops-secret-helper.service';
import { DEVOPS_SECRET_ERROR_MESSAGES, DEVOPS_SECRET_MAX_OUTPUT_BYTES, DEVOPS_SECRET_TIMEOUT_MS, parseDevopsSecretTask } from './devops-secret-helper.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createDevopsSecretWorkerClient(workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<DevopsSecretTask>> = () => new Worker(new URL('./devops-secret-helper.worker.ts', import.meta.url), { type: 'module', name: 'it-tools-devops-secret-helper' })) {
  return new BoundedTextWorkerClient<DevopsSecretTask>({
    errorMessages: DEVOPS_SECRET_ERROR_MESSAGES,
    maxOutputBytes: DEVOPS_SECRET_MAX_OUTPUT_BYTES,
    taskName: 'DevOps secret operation',
    timeoutMs: DEVOPS_SECRET_TIMEOUT_MS,
    validateTask: parseDevopsSecretTask,
    workerFactory,
  });
}
