/// <reference lib="webworker" />
import { inspectPemWorkspace, inspectPkcs12 } from './pkcs12-pem-workspace.service';
import { PKCS12_PEM_ERROR_MESSAGES, PKCS12_PEM_MAX_OUTPUT_BYTES, parsePkcs12PemTask } from './pkcs12-pem-workspace.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export async function handlePkcs12PemWorkerRequest(value: unknown): Promise<BoundedTextWorkerMessage> {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parsePkcs12PemTask);
    const output = task.kind === 'pkcs12'
      ? await inspectPkcs12(new Uint8Array(await task.file.arrayBuffer()), task.password)
      : await inspectPemWorkspace(task.source);
    const result = createBoundedTextResult(output, PKCS12_PEM_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: PKCS12_PEM_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: PKCS12_PEM_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', async event => scope.postMessage(await handlePkcs12PemWorkerRequest(event.data)));
