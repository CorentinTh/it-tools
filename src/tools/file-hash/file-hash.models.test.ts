import { describe, expect, it } from 'vitest';
import { sanitizeFileNameForDisplay } from './file-hash.models';

describe('file hash display models', () => {
  it('preserves ordinary Unicode names', () => {
    expect(sanitizeFileNameForDisplay('release-🚀.tar.zst')).toBe('release-🚀.tar.zst');
  });

  it('replaces control, bidi, invisible-format, line-separator, and unpaired-surrogate code points', () => {
    const sanitized = sanitizeFileNameForDisplay(
      'safe\u0000\u202Ename\u200B\u2060\uFEFF\u2028\u2029\uD800.txt',
    );

    expect(sanitized).toBe('safe��name������.txt');
    expect(sanitized).not.toContain('\u0000');
    expect(sanitized).not.toContain('\u202E');
    expect(Array.from(sanitized).some((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint >= 0xD800 && codePoint <= 0xDFFF;
    })).toBe(false);
  });

  it('bounds displayed names by grapheme without splitting joined Unicode clusters', () => {
    const family = '👨\u200D👩\u200D👧\u200D👦';
    const sanitized = sanitizeFileNameForDisplay(`${'a'.repeat(159)}${family}hidden.txt`);

    expect(sanitized).toBe(`${'a'.repeat(159)}👨�👩�👧�👦…`);
  });

  it('makes significant leading and trailing spaces visible', () => {
    expect(sanitizeFileNameForDisplay(' report.bin  ')).toBe('␠report.bin␠␠');
  });

  it('uses a stable fallback for blank names', () => {
    expect(sanitizeFileNameForDisplay(' \t ')).toBe('Unnamed file');
  });
});
