import {
  LIST_CONVERTER_ERROR_MESSAGES,
  LIST_CONVERTER_MAX_OUTPUT_BYTES,
  LIST_CONVERTER_TASK_TIMEOUT_MS,
  type ListConverterTask,
  parseListConverterTask,
} from './list-converter.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createListConverterWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<ListConverterTask>> = () => new Worker(
    new URL('./list-converter.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-list-converter' },
  ),
  timeoutMs = LIST_CONVERTER_TASK_TIMEOUT_MS,
): BoundedTextWorkerClient<ListConverterTask> {
  return new BoundedTextWorkerClient({
    errorMessages: LIST_CONVERTER_ERROR_MESSAGES,
    maxOutputBytes: LIST_CONVERTER_MAX_OUTPUT_BYTES,
    taskName: 'List conversion',
    timeoutMs,
    validateTask: parseListConverterTask,
    workerFactory,
  });
}
