/// <reference lib="webworker" />

import { processJsonWorkspace } from './json-repair-query.service';
import { JSON_WORKSPACE_ERROR_MESSAGES, JSON_WORKSPACE_MAX_OUTPUT_BYTES, parseJsonWorkspaceTask } from './json-repair-query.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleJsonWorkspaceRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseJsonWorkspaceTask);
    const result = createBoundedTextResult(processJsonWorkspace(task), JSON_WORKSPACE_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: JSON_WORKSPACE_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: JSON_WORKSPACE_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', event => scope.postMessage(handleJsonWorkspaceRequest(event.data)));
