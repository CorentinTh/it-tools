import markdownit from 'markdown-it';
import {
  MARKDOWN_ERROR_MESSAGES,
  MARKDOWN_MAX_OUTPUT_BYTES,
  parseMarkdownRenderTask,
} from './markdown-to-html.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface MarkdownWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

const renderer = markdownit();

export function handleMarkdownWorkerRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseMarkdownRenderTask);
    const result = createBoundedTextResult(renderer.render(task.source), MARKDOWN_MAX_OUTPUT_BYTES);
    return result === undefined
      ? { jobId, type: 'error', code: 'output-limit', message: MARKDOWN_ERROR_MESSAGES['output-limit'] }
      : { jobId, type: 'result', result };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: MARKDOWN_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as MarkdownWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleMarkdownWorkerRequest(event.data)));
