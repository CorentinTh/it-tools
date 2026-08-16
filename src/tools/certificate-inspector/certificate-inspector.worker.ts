/// <reference lib="webworker" />

import { inspectPem } from './certificate-inspector.service';
import { CERTIFICATE_INSPECTOR_ERROR_MESSAGES, CERTIFICATE_INSPECTOR_MAX_OUTPUT_BYTES, parseCertificateInspectorTask } from './certificate-inspector.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export async function handleCertificateInspectorRequest(value: unknown): Promise<BoundedTextWorkerMessage> {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseCertificateInspectorTask);
    const output = JSON.stringify(await inspectPem(task.source), null, 2);
    const result = createBoundedTextResult(output, CERTIFICATE_INSPECTOR_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: CERTIFICATE_INSPECTOR_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: CERTIFICATE_INSPECTOR_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', (event) => {
  handleCertificateInspectorRequest(event.data).then(response => scope.postMessage(response));
});
