/// <reference lib="webworker" />

import { processDevopsConfig } from './devops-config-workspace.service';
import { DEVOPS_CONFIG_ERROR_MESSAGES, DEVOPS_CONFIG_MAX_OUTPUT_BYTES, parseDevopsConfigTask } from './devops-config-workspace.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleDevopsConfigRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseDevopsConfigTask);
    const result = createBoundedTextResult(processDevopsConfig(task), DEVOPS_CONFIG_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: DEVOPS_CONFIG_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: DEVOPS_CONFIG_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', event => scope.postMessage(handleDevopsConfigRequest(event.data)));
