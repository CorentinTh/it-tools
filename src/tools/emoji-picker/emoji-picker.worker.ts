/// <reference lib="webworker" />

import Fuse from 'fuse.js';
import emojiKeywords from 'emojilib';
import emojiUnicodeData from 'unicode-emoji-json';
import { addEmojiKeywords, createEmojiCatalog } from './emoji-picker.model';
import {
  EMOJI_SEARCH_ERROR_MESSAGES,
  EMOJI_SEARCH_MAX_RESULT_BYTES,
  parseEmojiSearchTask,
} from './emoji-picker.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface EmojiSearchWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

async function searchEmoji(query: string): Promise<string> {
  const catalog = addEmojiKeywords(createEmojiCatalog(emojiUnicodeData), emojiKeywords);
  const searchEngine = new Fuse(catalog, {
    keys: ['group', { name: 'name', weight: 3 }, 'keywords', 'unicode', 'codePoints', 'emoji'],
    threshold: 0.3,
    useExtendedSearch: true,
    isCaseSensitive: false,
  });
  return JSON.stringify(searchEngine.search(query).map(({ item }) => item.emoji));
}

export async function handleEmojiSearchWorkerRequest(value: unknown): Promise<BoundedTextWorkerMessage> {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseEmojiSearchTask);
    const result = createBoundedTextResult(await searchEmoji(task.query), EMOJI_SEARCH_MAX_RESULT_BYTES);
    return result === undefined
      ? { jobId, type: 'error', code: 'output-limit', message: EMOJI_SEARCH_ERROR_MESSAGES['output-limit'] }
      : { jobId, type: 'result', result };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: EMOJI_SEARCH_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as EmojiSearchWorkerScope;
workerScope.addEventListener('message', async event => workerScope.postMessage(await handleEmojiSearchWorkerRequest(event.data)));
