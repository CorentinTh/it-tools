import {
  JSON_TO_CSV_ERROR_MESSAGES,
  JSON_TO_CSV_MAX_OUTPUT_BYTES,
  JSON_TO_CSV_TASK_TIMEOUT_MS,
  type JsonToCsvTask,
  parseJsonToCsvTask,
} from './json-to-csv.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createJsonToCsvWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<JsonToCsvTask>> = () => new Worker(
    new URL('./json-to-csv.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-json-to-csv' },
  ),
  timeoutMs = JSON_TO_CSV_TASK_TIMEOUT_MS,
): BoundedTextWorkerClient<JsonToCsvTask> {
  return new BoundedTextWorkerClient({
    errorMessages: JSON_TO_CSV_ERROR_MESSAGES,
    maxOutputBytes: JSON_TO_CSV_MAX_OUTPUT_BYTES,
    taskName: 'JSON-to-CSV conversion',
    timeoutMs,
    validateTask: parseJsonToCsvTask,
    workerFactory,
  });
}
