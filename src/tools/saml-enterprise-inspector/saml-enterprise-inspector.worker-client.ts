import type { SamlInspectionTask } from './saml-enterprise-inspector.worker.protocol';
import { SAML_ERROR_MESSAGES, SAML_MAX_OUTPUT_BYTES, SAML_TIMEOUT_MS, parseSamlInspectionTask } from './saml-enterprise-inspector.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createSamlInspectionWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<SamlInspectionTask>> = () => new Worker(
    new URL('./saml-enterprise-inspector.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-saml-inspector' },
  ),
): BoundedTextWorkerClient<SamlInspectionTask> {
  return new BoundedTextWorkerClient({
    errorMessages: SAML_ERROR_MESSAGES,
    maxOutputBytes: SAML_MAX_OUTPUT_BYTES,
    taskName: 'SAML inspection',
    timeoutMs: SAML_TIMEOUT_MS,
    validateTask: parseSamlInspectionTask,
    workerFactory,
  });
}
