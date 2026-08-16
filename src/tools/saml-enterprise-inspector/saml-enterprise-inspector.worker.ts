/// <reference lib="webworker" />
import { inspectSamlMessage } from './saml-enterprise-inspector.service';
import { SAML_ERROR_MESSAGES, SAML_MAX_OUTPUT_BYTES, parseSamlInspectionTask } from './saml-enterprise-inspector.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export async function handleSamlInspectionRequest(value: unknown): Promise<BoundedTextWorkerMessage> {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseSamlInspectionTask);
    const result = createBoundedTextResult(await inspectSamlMessage(task.source, task.binding), SAML_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: SAML_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: SAML_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', async event => scope.postMessage(await handleSamlInspectionRequest(event.data)));
