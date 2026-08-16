import type { MarkdownTableTask } from './markdown-table-generator.service';
import { MARKDOWN_TABLE_ERROR_MESSAGES, MARKDOWN_TABLE_MAX_OUTPUT_BYTES, MARKDOWN_TABLE_TIMEOUT_MS, parseMarkdownTableTask } from './markdown-table-generator.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createMarkdownTableWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<MarkdownTableTask>> = () => new Worker(
    new URL('./markdown-table-generator.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-markdown-table-generator' },
  ),
): BoundedTextWorkerClient<MarkdownTableTask> {
  return new BoundedTextWorkerClient({
    errorMessages: MARKDOWN_TABLE_ERROR_MESSAGES,
    maxOutputBytes: MARKDOWN_TABLE_MAX_OUTPUT_BYTES,
    taskName: 'Markdown table generation',
    timeoutMs: MARKDOWN_TABLE_TIMEOUT_MS,
    validateTask: parseMarkdownTableTask,
    workerFactory,
  });
}
