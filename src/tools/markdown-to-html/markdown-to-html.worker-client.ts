import {
  MARKDOWN_ERROR_MESSAGES,
  MARKDOWN_MAX_OUTPUT_BYTES,
  MARKDOWN_TASK_TIMEOUT_MS,
  type MarkdownRenderTask,
  parseMarkdownRenderTask,
} from './markdown-to-html.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';

export function createMarkdownWorkerClient(): BoundedTextWorkerClient<MarkdownRenderTask> {
  return new BoundedTextWorkerClient({
    errorMessages: MARKDOWN_ERROR_MESSAGES,
    maxOutputBytes: MARKDOWN_MAX_OUTPUT_BYTES,
    taskName: 'Markdown rendering',
    timeoutMs: MARKDOWN_TASK_TIMEOUT_MS,
    validateTask: parseMarkdownRenderTask,
    workerFactory: () => new Worker(new URL('./markdown-to-html.worker.ts', import.meta.url), {
      type: 'module',
      name: 'it-tools-markdown-renderer',
    }),
  });
}
