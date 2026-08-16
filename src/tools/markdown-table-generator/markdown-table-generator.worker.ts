/// <reference lib="webworker" />
import { generateMarkdownTable } from './markdown-table-generator.service';
import { MARKDOWN_TABLE_ERROR_MESSAGES, MARKDOWN_TABLE_MAX_OUTPUT_BYTES, parseMarkdownTableTask } from './markdown-table-generator.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleMarkdownTableRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const request = parseBoundedTextWorkerRequest(value, parseMarkdownTableTask);
    const result = createBoundedTextResult(generateMarkdownTable(request.task), MARKDOWN_TABLE_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: MARKDOWN_TABLE_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit') ? error.code : 'processing';
    return { jobId, type: 'error', code, message: MARKDOWN_TABLE_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', event => scope.postMessage(handleMarkdownTableRequest(event.data)));
