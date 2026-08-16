/// <reference lib="webworker" />
import { compareMarkdown } from './markdown-diff.service';
import { MARKDOWN_DIFF_ERROR_MESSAGES, MARKDOWN_DIFF_MAX_OUTPUT_BYTES, parseMarkdownDiffTask } from './markdown-diff.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleMarkdownDiffRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseMarkdownDiffTask);
    const result = createBoundedTextResult(compareMarkdown(task), MARKDOWN_DIFF_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: MARKDOWN_DIFF_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: MARKDOWN_DIFF_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', event => scope.postMessage(handleMarkdownDiffRequest(event.data)));
