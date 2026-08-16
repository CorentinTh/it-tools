import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const EMOJI_SEARCH_DEBOUNCE_MS = 150;
export const EMOJI_SEARCH_MAX_QUERY_BYTES = 256;
export const EMOJI_SEARCH_MAX_RESULT_BYTES = 128 * 1024;
export const EMOJI_SEARCH_MAX_RESULTS = 2_000;
export const EMOJI_SEARCH_TIMEOUT_MS = 3_000;

export interface EmojiSearchTask {
  query: string
}

export const EMOJI_SEARCH_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter an emoji search query.',
  'input-limit': `Emoji search is limited to ${EMOJI_SEARCH_MAX_QUERY_BYTES} UTF-8 bytes.`,
  'output-limit': 'Emoji search returned too many results.',
  'processing': 'Emoji search could not be completed.',
};

export function parseEmojiSearchTask(value: unknown): EmojiSearchTask {
  if (
    !isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'query'
    || typeof value.query !== 'string'
    || value.query.trim() === ''
  ) {
    throw new BoundedTextTaskError('validation', EMOJI_SEARCH_ERROR_MESSAGES.validation);
  }
  const query = value.query.trim();
  if (exceedsUtf8ByteLimit(query, EMOJI_SEARCH_MAX_QUERY_BYTES)) {
    throw new BoundedTextTaskError('input-limit', EMOJI_SEARCH_ERROR_MESSAGES['input-limit']);
  }
  return { query };
}

export function parseEmojiSearchResult(value: string): string[] | undefined {
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      !Array.isArray(parsed)
      || parsed.length > EMOJI_SEARCH_MAX_RESULTS
      || parsed.some(emoji => typeof emoji !== 'string' || emoji === '' || emoji.length > 32)
      || new Set(parsed).size !== parsed.length
    ) {
      return undefined;
    }
    return parsed;
  }
  catch {
    return undefined;
  }
}
