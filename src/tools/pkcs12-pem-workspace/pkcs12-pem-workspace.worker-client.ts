import type { Pkcs12PemTask } from './pkcs12-pem-workspace.worker.protocol';
import { PKCS12_PEM_ERROR_MESSAGES, PKCS12_PEM_MAX_OUTPUT_BYTES, PKCS12_PEM_TIMEOUT_MS, parsePkcs12PemTask } from './pkcs12-pem-workspace.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createPkcs12PemWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<Pkcs12PemTask>> = () => new Worker(
    new URL('./pkcs12-pem-workspace.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-pkcs12-pem-workspace' },
  ),
  timeoutMs = PKCS12_PEM_TIMEOUT_MS,
) {
  return new BoundedTextWorkerClient({
    errorMessages: PKCS12_PEM_ERROR_MESSAGES,
    maxOutputBytes: PKCS12_PEM_MAX_OUTPUT_BYTES,
    taskName: 'PKCS#12 / PEM processing',
    timeoutMs,
    validateTask: parsePkcs12PemTask,
    workerFactory,
  });
}
