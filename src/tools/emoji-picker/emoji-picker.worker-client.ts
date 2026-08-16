import {
  EMOJI_SEARCH_ERROR_MESSAGES,
  EMOJI_SEARCH_MAX_RESULT_BYTES,
  EMOJI_SEARCH_TIMEOUT_MS,
  type EmojiSearchTask,
  parseEmojiSearchResult,
  parseEmojiSearchTask,
} from './emoji-picker.worker.protocol';
import { BoundedTextTaskError, BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle, WorkerTaskResult } from '@/utils/worker-task';

export interface EmojiSearchClient {
  cancel: () => void
  dispose: () => void
  search: (query: string) => Promise<WorkerTaskResult<string[]>>
}

export function createEmojiSearchWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<EmojiSearchTask>> = () => new Worker(
    new URL('./emoji-picker.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-emoji-search' },
  ),
  timeoutMs = EMOJI_SEARCH_TIMEOUT_MS,
): EmojiSearchClient {
  const client = new BoundedTextWorkerClient<EmojiSearchTask>({
    errorMessages: EMOJI_SEARCH_ERROR_MESSAGES,
    maxOutputBytes: EMOJI_SEARCH_MAX_RESULT_BYTES,
    taskName: 'emoji search',
    timeoutMs,
    validateTask: parseEmojiSearchTask,
    workerFactory,
  });

  return {
    cancel: () => client.cancel(),
    dispose: () => client.dispose(),
    async search(query) {
      const result = await client.run({ query });
      const emojis = parseEmojiSearchResult(result.value);
      if (!emojis) {
        throw new BoundedTextTaskError('worker', 'The emoji search worker returned an invalid result.');
      }
      return { elapsedMs: result.elapsedMs, value: emojis };
    },
  };
}
