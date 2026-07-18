import { describe, expect, it } from 'vitest';
import { getStringSizeInBytes, getTextStatistics } from './text-statistics.service';

describe('text-statistics', () => {
  describe('getTextStatistics', () => {
    it('returns zero statistics for empty input', () => {
      expect(getTextStatistics('')).toEqual({
        characterCount: 0,
        wordCount: 0,
        lineCount: 0,
        byteSize: 0,
      });
    });

    it('does not count whitespace-only input as words', () => {
      expect(getTextStatistics(' \t\r\n\u00A0\u3000')).toEqual({
        characterCount: 6,
        wordCount: 0,
        lineCount: 2,
        byteSize: 9,
      });
    });

    it('counts whitespace-delimited words and CR/LF line endings', () => {
      expect(getTextStatistics(' hello\r\nworld\nagain ')).toEqual({
        characterCount: 20,
        wordCount: 3,
        lineCount: 3,
        byteSize: 20,
      });
    });

    it('preserves UTF-16 character semantics and counts Unicode UTF-8 bytes', () => {
      expect(getTextStatistics('café 😀\u2003東京')).toEqual({
        characterCount: 10,
        wordCount: 3,
        lineCount: 1,
        byteSize: 19,
      });
    });

    it('matches TextEncoder for unmatched UTF-16 surrogates', () => {
      expect(getTextStatistics('\uD800').byteSize).toBe(new TextEncoder().encode('\uD800').byteLength);
      expect(getTextStatistics('\uDC00').byteSize).toBe(new TextEncoder().encode('\uDC00').byteLength);
    });
  });

  describe('getStringSizeInBytes', () => {
    it('should return the size of a string in bytes', () => {
      expect(getStringSizeInBytes('')).toEqual(0);
      expect(getStringSizeInBytes('a')).toEqual(1);
      expect(getStringSizeInBytes('aa')).toEqual(2);
      expect(getStringSizeInBytes('😀')).toEqual(4);
      expect(getStringSizeInBytes('aaaaaaaaaa')).toEqual(10);
    });
  });
});
