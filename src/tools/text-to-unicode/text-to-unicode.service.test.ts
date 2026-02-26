import { describe, expect, it } from 'vitest';
import { convertTextToUnicode, convertTextToUnicodeHex, convertUnicodeToText } from './text-to-unicode.service';

describe('text-to-unicode', () => {
  describe('convertTextToUnicode', () => {
    it('a text string is converted to unicode representation', () => {
      expect(convertTextToUnicode('A')).toBe('&#65;');
      expect(convertTextToUnicode('linke the string convert to unicode')).toBe('&#108;&#105;&#110;&#107;&#101;&#32;&#116;&#104;&#101;&#32;&#115;&#116;&#114;&#105;&#110;&#103;&#32;&#99;&#111;&#110;&#118;&#101;&#114;&#116;&#32;&#116;&#111;&#32;&#117;&#110;&#105;&#99;&#111;&#100;&#101;');
      expect(convertTextToUnicode('')).toBe('');
    });
  });

  describe('convertTextToUnicodeHex', () => {
    it('converts text to \\uXXXX representation', () => {
      expect(convertTextToUnicodeHex('A')).toBe('\\u0041');
      expect(convertTextToUnicodeHex('it-tools')).toBe('\\u0069\\u0074\\u002d\\u0074\\u006f\\u006f\\u006c\\u0073');
      expect(convertTextToUnicodeHex('')).toBe('');
    });
  });

  describe('convertUnicodeToText', () => {
    it('decodes &#decimal; to text', () => {
      expect(convertUnicodeToText('&#65;')).toBe('A');
      expect(convertUnicodeToText('&#108;&#105;&#110;&#107;&#101;&#32;&#116;&#104;&#101;&#32;&#115;&#116;&#114;&#105;&#110;&#103;&#32;&#99;&#111;&#110;&#118;&#101;&#114;&#116;&#32;&#116;&#111;&#32;&#117;&#110;&#105;&#99;&#111;&#100;&#101;')).toBe('linke the string convert to unicode');
      expect(convertUnicodeToText('')).toBe('');
    });

    it('decodes \\uXXXX to text', () => {
      expect(convertUnicodeToText('\\u0041')).toBe('A');
      expect(convertUnicodeToText('\\u0069\\u0074\\u002d\\u0074\\u006f\\u006f\\u006c\\u0073')).toBe('it-tools');
    });

    it('decodes mixed &#xxx; and \\uXXXX to text', () => {
      expect(convertUnicodeToText('&#65;\\u0066')).toBe('Af');
    });
  });
});
