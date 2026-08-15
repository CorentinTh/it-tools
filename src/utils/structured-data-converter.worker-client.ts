import {
  STRUCTURED_CONVERTER_ERROR_MESSAGES,
  STRUCTURED_CONVERTER_MAX_OUTPUT_BYTES,
  STRUCTURED_CONVERTER_TASK_TIMEOUT_MS,
  type StructuredDataConversion,
  type StructuredDataConversionTask,
  parseStructuredDataConversionTask,
} from './structured-data-converter.worker.protocol';
import { BoundedTextWorkerClient } from './bounded-text-task';
import type { WorkerTaskHandle } from './worker-task';
import type { WorkerTaskRequest } from './worker-protocol';

export interface StructuredDataConverterClientOptions {
  allowedConversions: readonly StructuredDataConversion[]
  taskName: string
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<StructuredDataConversionTask>>
}

export function createStructuredDataConverterWorkerClient({
  allowedConversions,
  taskName,
  workerFactory,
}: StructuredDataConverterClientOptions): BoundedTextWorkerClient<StructuredDataConversionTask> {
  return new BoundedTextWorkerClient({
    errorMessages: STRUCTURED_CONVERTER_ERROR_MESSAGES,
    maxOutputBytes: STRUCTURED_CONVERTER_MAX_OUTPUT_BYTES,
    taskName,
    timeoutMs: STRUCTURED_CONVERTER_TASK_TIMEOUT_MS,
    validateTask: value => parseStructuredDataConversionTask(value, allowedConversions),
    workerFactory,
  });
}
