import { describe, expect, it } from 'vitest';
import { handleEmojiSearchWorkerRequest } from './emoji-picker.worker';
import {
  EMOJI_SEARCH_ERROR_MESSAGES,
  EMOJI_SEARCH_MAX_QUERY_BYTES,
  parseEmojiSearchResult,
  parseEmojiSearchTask,
} from './emoji-picker.worker.protocol';

describe('Emoji search worker', () => {
  it('accepts exact bounded queries and strict unique result arrays', () => {
    expect(parseEmojiSearchTask({ query: ' face ' })).toEqual({ query: 'face' });
    expect(() => parseEmojiSearchTask({ query: 'face', leaked: true })).toThrow(EMOJI_SEARCH_ERROR_MESSAGES.validation);
    expect(() => parseEmojiSearchTask({ query: 'x'.repeat(EMOJI_SEARCH_MAX_QUERY_BYTES + 1) }))
      .toThrow(EMOJI_SEARCH_ERROR_MESSAGES['input-limit']);
    expect(parseEmojiSearchResult('["🙂","😀"]')).toEqual(['🙂', '😀']);
    expect(parseEmojiSearchResult('["🙂","🙂"]')).toBeUndefined();
    expect(parseEmojiSearchResult('{"query":"secret"}')).toBeUndefined();
  });

  it('searches names and lazy synonym metadata off the main thread', async () => {
    const response = await handleEmojiSearchWorkerRequest({ jobId: 6, task: { query: 'United Nations' } });
    expect(response).toMatchObject({ jobId: 6, type: 'result' });
    if (response.type !== 'result') {
      throw new Error('Expected an emoji search result.');
    }
    expect(parseEmojiSearchResult(response.result.value)).toContain('🇺🇳');
  });

  it('returns static errors without echoing malformed query content', async () => {
    await expect(handleEmojiSearchWorkerRequest({ jobId: 9, task: { query: '', secret: 'do-not-echo' } }))
      .resolves.toEqual({
        jobId: 9,
        type: 'error',
        code: 'validation',
        message: EMOJI_SEARCH_ERROR_MESSAGES.validation,
      });
  });
});
