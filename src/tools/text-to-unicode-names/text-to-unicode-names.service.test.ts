import { describe, expect, it } from 'vitest';
import { convertTextToUnicodeNames } from './text-to-unicode-names.service';

describe('text-to-binary', () => {
  describe('convertTextToUnicodeNames', () => {
    it('a text string is converted to its unicode names representation', () => {
      expect(convertTextToUnicodeNames('A')).toBe(
        'U+0041 (LATIN CAPITAL LETTER A)');
      expect(convertTextToUnicodeNames('hello')).toBe(
        'U+0068 (LATIN SMALL LETTER H) U+0065 (LATIN SMALL LETTER E) U+006C (LATIN SMALL LETTER L) U+006C (LATIN SMALL LETTER L) U+006F (LATIN SMALL LETTER O)');
      expect(convertTextToUnicodeNames('')).toBe(
        '');
      expect(convertTextToUnicodeNames('être 1 $ ¤ …')).toBe(
        'U+00EA (LATIN SMALL LETTER E WITH CIRCUMFLEX) U+0074 (LATIN SMALL LETTER T) U+0072 (LATIN SMALL LETTER R) U+0065 (LATIN SMALL LETTER E) U+0020 (SPACE) U+0031 (DIGIT ONE) U+0020 (SPACE) U+0024 (DOLLAR SIGN) U+0020 (SPACE) U+00A4 (CURRENCY SIGN) U+0020 (SPACE) U+2026 (HORIZONTAL ELLIPSIS)');
      expect(convertTextToUnicodeNames('⁇ 𥆧 💩')).toBe(
        'U+2047 (DOUBLE QUESTION MARK) U+0020 (SPACE) U+251A7 (CJK Ideograph Extension B) U+0020 (SPACE) U+1F4A9 (PILE OF POO)');
    });
    it('the separator between octets can be changed', () => {
      expect(convertTextToUnicodeNames('hello', { separator: ' ; ' })).toBe(
        'U+0068 (LATIN SMALL LETTER H) ; U+0065 (LATIN SMALL LETTER E) ; U+006C (LATIN SMALL LETTER L) ; U+006C (LATIN SMALL LETTER L) ; U+006F (LATIN SMALL LETTER O)');
    });
  });
});
