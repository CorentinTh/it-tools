import type { MarkdownDiffTask } from './markdown-diff.service';
import { MARKDOWN_DIFF_ERROR_MESSAGES, MARKDOWN_DIFF_MAX_OUTPUT_BYTES, MARKDOWN_DIFF_TIMEOUT_MS, parseMarkdownDiffTask } from './markdown-diff.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createMarkdownDiffWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<MarkdownDiffTask>> = () => new Worker(
    new URL('./markdown-diff.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-markdown-diff' },
  ),
): BoundedTextWorkerClient<MarkdownDiffTask> {
  return new BoundedTextWorkerClient({
    errorMessages: MARKDOWN_DIFF_ERROR_MESSAGES,
    maxOutputBytes: MARKDOWN_DIFF_MAX_OUTPUT_BYTES,
    taskName: 'Markdown diff',
    timeoutMs: MARKDOWN_DIFF_TIMEOUT_MS,
    validateTask: parseMarkdownDiffTask,
    workerFactory,
  });
}
