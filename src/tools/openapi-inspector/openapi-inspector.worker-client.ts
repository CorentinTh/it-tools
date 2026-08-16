import type { OpenApiInspectionTask } from './openapi-inspector.worker.protocol';
import { OPENAPI_ERROR_MESSAGES, OPENAPI_MAX_OUTPUT_BYTES, OPENAPI_TIMEOUT_MS, parseOpenApiTask } from './openapi-inspector.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createOpenApiWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<OpenApiInspectionTask>> = () => new Worker(
    new URL('./openapi-inspector.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-openapi-inspector' },
  ),
  timeoutMs = OPENAPI_TIMEOUT_MS,
) {
  return new BoundedTextWorkerClient({
    errorMessages: OPENAPI_ERROR_MESSAGES,
    maxOutputBytes: OPENAPI_MAX_OUTPUT_BYTES,
    taskName: 'OpenAPI inspection',
    timeoutMs,
    validateTask: parseOpenApiTask,
    workerFactory,
  });
}
