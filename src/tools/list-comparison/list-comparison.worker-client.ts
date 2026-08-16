import type { ListComparisonTask } from './list-comparison.service';
import { LIST_COMPARISON_ERROR_MESSAGES, LIST_COMPARISON_MAX_OUTPUT_BYTES, LIST_COMPARISON_TIMEOUT_MS, parseListComparisonTask } from './list-comparison.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createListComparisonWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<ListComparisonTask>> = () => new Worker(
    new URL('./list-comparison.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-list-comparison' },
  ),
): BoundedTextWorkerClient<ListComparisonTask> {
  return new BoundedTextWorkerClient({
    errorMessages: LIST_COMPARISON_ERROR_MESSAGES,
    maxOutputBytes: LIST_COMPARISON_MAX_OUTPUT_BYTES,
    taskName: 'List comparison',
    timeoutMs: LIST_COMPARISON_TIMEOUT_MS,
    validateTask: parseListComparisonTask,
    workerFactory,
  });
}
