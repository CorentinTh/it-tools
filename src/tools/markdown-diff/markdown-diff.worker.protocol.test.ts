import { describe, expect, it } from 'vitest';
import { MARKDOWN_DIFF_MAX_SIDE_BYTES, parseMarkdownDiffTask } from './markdown-diff.worker.protocol';

describe('Markdown diff worker protocol', () => {
  it('accepts the exact bounded task shape', () => {
    expect(parseMarkdownDiffTask({ left: '# old', right: '# new', granularity: 'line' })).toEqual({ left: '# old', right: '# new', granularity: 'line' });
  });

  it.each([
    null,
    [],
    {},
    { left: '', right: '', granularity: 'line' },
    { left: 'a', right: 'b', granularity: 'character' },
    { left: 'a', right: 'b', granularity: 'line', extra: true },
  ])('rejects malformed tasks without accepting extra fields: %j', (value) => {
    expect(() => parseMarkdownDiffTask(value)).toThrow();
  });

  it('rejects oversized UTF-8 input', () => {
    expect(() => parseMarkdownDiffTask({ left: '😀'.repeat(MARKDOWN_DIFF_MAX_SIDE_BYTES / 4 + 1), right: '', granularity: 'line' })).toThrow(/256 KiB/u);
  });
});
