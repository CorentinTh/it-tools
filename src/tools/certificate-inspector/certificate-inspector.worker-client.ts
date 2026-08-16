import { CERTIFICATE_INSPECTOR_ERROR_MESSAGES, CERTIFICATE_INSPECTOR_MAX_OUTPUT_BYTES, CERTIFICATE_INSPECTOR_TIMEOUT_MS, type CertificateInspectorTask, parseCertificateInspectorTask } from './certificate-inspector.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createCertificateInspectorWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<CertificateInspectorTask>> = () => new Worker(
    new URL('./certificate-inspector.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-certificate-inspector' },
  ),
): BoundedTextWorkerClient<CertificateInspectorTask> {
  return new BoundedTextWorkerClient({
    errorMessages: CERTIFICATE_INSPECTOR_ERROR_MESSAGES,
    maxOutputBytes: CERTIFICATE_INSPECTOR_MAX_OUTPUT_BYTES,
    taskName: 'certificate inspection',
    timeoutMs: CERTIFICATE_INSPECTOR_TIMEOUT_MS,
    validateTask: parseCertificateInspectorTask,
    workerFactory,
  });
}
