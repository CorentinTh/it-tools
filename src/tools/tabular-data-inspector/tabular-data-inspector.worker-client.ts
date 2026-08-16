import type { TabularDataTask } from './tabular-data-inspector.service';
import { TABULAR_ERROR_MESSAGES, TABULAR_MAX_OUTPUT_BYTES, TABULAR_TIMEOUT_MS, parseTabularDataTask } from './tabular-data-inspector.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createTabularDataWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<TabularDataTask>> = () => new Worker(
    new URL('./tabular-data-inspector.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-tabular-data-inspector' },
  ),
) {
  return new BoundedTextWorkerClient<TabularDataTask>({
    errorMessages: TABULAR_ERROR_MESSAGES,
    maxOutputBytes: TABULAR_MAX_OUTPUT_BYTES,
    taskName: 'Tabular data processing',
    timeoutMs: TABULAR_TIMEOUT_MS,
    validateTask: parseTabularDataTask,
    workerFactory,
  });
}
