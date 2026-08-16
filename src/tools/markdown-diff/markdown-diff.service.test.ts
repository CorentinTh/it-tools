import { describe, expect, it } from 'vitest';
import { MARKDOWN_DIFF_MAX_LINES_PER_SIDE, compareMarkdown, isMarkdownDiffTaskStale } from './markdown-diff.service';

describe('Markdown diff service', () => {
  it('produces a deterministic line-oriented source diff', () => {
    const report = compareMarkdown({ left: '# Title\nold\nshared', right: '# Title\nnew\nshared\nadded', granularity: 'line' });
    expect(report).toContain('Markdown source diff — line granularity');
    expect(report).toContain('  # Title');
    expect(report).toContain('- old');
    expect(report).toContain('+ new');
    expect(report).toContain('+ added');
  });

  it('reports exact word, whitespace, and punctuation fragments', () => {
    const report = compareMarkdown({ left: 'Hello **old** world', right: 'Hello **new** world!', granularity: 'word' });
    expect(report).toContain('Markdown source diff — word/token granularity');
    expect(report).toContain('- "old"');
    expect(report).toContain('+ "new"');
    expect(report).toContain('+ "!"');
  });

  it('normalizes line endings and trims common prefixes and suffixes before applying the cell limit', () => {
    expect(compareMarkdown({ left: 'a\r\nb', right: 'a\nb', granularity: 'line' })).toContain('removed: 0; added: 0');
    const unchanged = Array.from({ length: MARKDOWN_DIFF_MAX_LINES_PER_SIDE }, (_, index) => `line-${index}`).join('\n');
    expect(compareMarkdown({ left: unchanged, right: unchanged, granularity: 'line' })).toContain('removed: 0; added: 0');
  });

  it('treats an empty document as zero lines', () => {
    const report = compareMarkdown({ left: '', right: '# New', granularity: 'line' });
    expect(report).toContain('Left: 0 lines; right: 1 lines');
    expect(report).toContain('+ # New');
    expect(report).not.toContain('\n- ');
  });

  it('compares completed snapshots exactly even when inputs contain NUL characters', () => {
    const completed = { left: 'a\0b', right: 'c', granularity: 'line' as const };
    const collidingConcatenation = { left: 'a', right: 'b\0c', granularity: 'line' as const };
    expect(isMarkdownDiffTaskStale(completed, completed)).toBe(false);
    expect(isMarkdownDiffTaskStale(completed, collidingConcatenation)).toBe(true);
  });

  it('rejects excessive line, token, and alignment work before allocation', () => {
    const tooManyLines = Array.from({ length: MARKDOWN_DIFF_MAX_LINES_PER_SIDE + 1 }, () => 'x').join('\n');
    expect(() => compareMarkdown({ left: tooManyLines, right: '', granularity: 'line' })).toThrow(/line count/u);
    const tooManyTokens = Array.from({ length: 8_001 }, (_, index) => `w${index}`).join(' ');
    expect(() => compareMarkdown({ left: tooManyTokens, right: '', granularity: 'word' })).toThrow(/token count/u);
    const left = Array.from({ length: 1_000 }, (_, index) => `left-${index}`).join('\n');
    const right = Array.from({ length: 1_000 }, (_, index) => `right-${index}`).join('\n');
    expect(() => compareMarkdown({ left, right, granularity: 'line' })).toThrow(/alignment-work/u);
  });
});
