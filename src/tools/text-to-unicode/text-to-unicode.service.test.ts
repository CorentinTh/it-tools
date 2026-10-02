import { describe, expect, it } from 'vitest';
import { convertTextToUnicode, convertTextToUnicodeEscape, convertUnicodeEscapeToText, convertUnicodeToText } from './text-to-unicode.service';

describe('text-to-unicode', () => {
  describe('convertTextToUnicode', () => {
    it('a text string is converted to unicode representation', () => {
      expect(convertTextToUnicode('A')).toBe('&#65;');
      expect(convertTextToUnicode('linke the string convert to unicode')).toBe('&#108;&#105;&#110;&#107;&#101;&#32;&#116;&#104;&#101;&#32;&#115;&#116;&#114;&#105;&#110;&#103;&#32;&#99;&#111;&#110;&#118;&#101;&#114;&#116;&#32;&#116;&#111;&#32;&#117;&#110;&#105;&#99;&#111;&#100;&#101;');
      expect(convertTextToUnicode('')).toBe('');
    });

    it('astral characters are encoded by code point, not surrogate halves (#1081)', () => {
      expect(convertTextToUnicode('\u{1F4A9}')).toBe('&#128169;');
      expect(convertUnicodeToText('&#128169;')).toBe('\u{1F4A9}');
    });
  });

  describe('convertUnicodeToText', () => {
    it('an unicode string is converted to its text representation', () => {
      expect(convertUnicodeToText('&#65;')).toBe('A');
      expect(convertUnicodeToText('')).toBe('');
    });
  });

  describe('u-escape conversions (#1597)', () => {
    it('escapes BMP characters as 4-digit uXXXX', () => {
      expect(convertTextToUnicodeEscape('A')).toBe('\\u0041');
      expect(convertTextToUnicodeEscape('\u4E2D')).toBe('\\u4e2d');
    });

    it('escapes astral characters as 8-digit uXXXX', () => {
      expect(convertTextToUnicodeEscape('\u{1F4A9}')).toBe('\\u0001f4a9');
    });

    it('decodes uXXXX escapes back to text', () => {
      expect(convertUnicodeEscapeToText('\\u4e2d\\u6587')).toBe('\u4E2D\u6587');
      expect(convertUnicodeEscapeToText('\\u0001f4a9')).toBe('\u{1F4A9}');
    });

    it('round-trips mixed content', () => {
      const text = 'hi \u4E2D\u6587 \u{1F4A9}';
      expect(convertUnicodeEscapeToText(convertTextToUnicodeEscape(text))).toBe(text);
    });
  });
});
