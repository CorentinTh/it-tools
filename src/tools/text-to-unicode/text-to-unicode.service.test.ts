import { describe, expect, it } from 'vitest';
import { type ConverterId, SKIP_ASCII_HTML, SKIP_ASCII_JS, converters } from './text-to-unicode.service';

describe('text-to-unicode (legacy tests)', () => {
  const convertTextToUnicode = (text: string) => converters.decimalEntities.escape(text, false);
  const convertUnicodeToText = (escaped: string) => converters.decimalEntities.unescape(escaped);

  describe('convertTextToUnicode', () => {
    it('a text string is converted to unicode representation', () => {
      expect(convertTextToUnicode('A')).toBe('&#65;');
      expect(convertTextToUnicode('linke the string convert to unicode')).toBe('&#108;&#105;&#110;&#107;&#101;&#32;&#116;&#104;&#101;&#32;&#115;&#116;&#114;&#105;&#110;&#103;&#32;&#99;&#111;&#110;&#118;&#101;&#114;&#116;&#32;&#116;&#111;&#32;&#117;&#110;&#105;&#99;&#111;&#100;&#101;');
      expect(convertTextToUnicode('')).toBe('');
    });
  });

  describe('convertUnicodeToText', () => {
    it('an unicode string is converted to its text representation', () => {
      expect(convertUnicodeToText('&#65;')).toBe('A');
      expect(convertUnicodeToText('&#108;&#105;&#110;&#107;&#101;&#32;&#116;&#104;&#101;&#32;&#115;&#116;&#114;&#105;&#110;&#103;&#32;&#99;&#111;&#110;&#118;&#101;&#114;&#116;&#32;&#116;&#111;&#32;&#117;&#110;&#105;&#99;&#111;&#100;&#101;')).toBe('linke the string convert to unicode');
      expect(convertUnicodeToText('')).toBe('');
    });
  });
});

const ALL_PRINTABLE_ASCII = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

describe('text-to-unicode regexes', () => {
  // eslint-disable-next-line prefer-regex-literals
  const skipAsciiJs = new RegExp(String.raw`([[ -~]--['"\\]]+)`, 'gv');
  // eslint-disable-next-line prefer-regex-literals
  const skipAsciiHtml = new RegExp(String.raw`([[ -~]--[<>&'"]]+)`, 'gv');

  it('regexes are equivalent to `v`-flag versions', () => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets
    // regexes in `text-to-unicode.service.ts` can be replaced with `v`-flag versions once unicodeSets reaches
    // sufficient in-browser support
    expect(ALL_PRINTABLE_ASCII.match(skipAsciiJs)).toStrictEqual(ALL_PRINTABLE_ASCII.match(SKIP_ASCII_JS));
    expect(ALL_PRINTABLE_ASCII.match(skipAsciiHtml)).toStrictEqual(ALL_PRINTABLE_ASCII.match(SKIP_ASCII_HTML));
  });
});

describe('text-to-unicode', () => {
  interface TestConfig {
    text: string
    results: Record<ConverterId, string>
    skipAscii?: boolean
  };
  const tests: TestConfig[] = [
    {
      text: 'ABC',
      results: {
        fullUnicode: String.raw`\u0041\u0042\u0043`,
        utf16: String.raw`\u0041\u0042\u0043`,
        hexEntities: String.raw`&#x41;&#x42;&#x43;`,
        decimalEntities: String.raw`&#65;&#66;&#67;`,
      },
    },
    {
      text: 'ABC',
      skipAscii: true,
      results: {
        fullUnicode: 'ABC',
        utf16: 'ABC',
        hexEntities: 'ABC',
        decimalEntities: 'ABC',
      },
    },
    {
      text: ALL_PRINTABLE_ASCII,
      skipAscii: true,
      results: {
        // eslint-disable-next-line unicorn/escape-case
        fullUnicode: String.raw` !\u0022#$%&\u0027()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\u005c]^_${'`'}abcdefghijklmnopqrstuvwxyz{|}~`,
        // eslint-disable-next-line unicorn/escape-case
        utf16: String.raw` !\u0022#$%&\u0027()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\u005c]^_${'`'}abcdefghijklmnopqrstuvwxyz{|}~`,
        hexEntities: String.raw` !&#x22;#$%&#x26;&#x27;()*+,-./0123456789:;&#x3c;=&#x3e;?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_${'`'}abcdefghijklmnopqrstuvwxyz{|}~`,
        decimalEntities: String.raw` !&#34;#$%&#38;&#39;()*+,-./0123456789:;&#60;=&#62;?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_${'`'}abcdefghijklmnopqrstuvwxyz{|}~`,
      },
    },
    {
      text: '文字',
      results: {
        // eslint-disable-next-line unicorn/escape-case
        fullUnicode: String.raw`\u6587\u5b57`,
        // eslint-disable-next-line unicorn/escape-case
        utf16: String.raw`\u6587\u5b57`,
        hexEntities: String.raw`&#x6587;&#x5b57;`,
        decimalEntities: String.raw`&#25991;&#23383;`,
      },
    },
    {
      text: 'a 💩 b',
      skipAscii: true,
      results: {
        // eslint-disable-next-line unicorn/escape-case
        fullUnicode: String.raw`a \u{1f4a9} b`,
        // eslint-disable-next-line unicorn/escape-case
        utf16: String.raw`a \ud83d\udca9 b`,
        hexEntities: String.raw`a &#x1f4a9; b`,
        decimalEntities: String.raw`a &#128169; b`,
      },
    },
  ];

  for (const { text, skipAscii, results } of tests) {
    describe(`${text} (skipAscii=${skipAscii})`, () => {
      for (const [key, result] of Object.entries(results)) {
        describe(key, () => {
          const converter = converters[key as ConverterId];
          it('Escaping', () => {
            expect(converter.escape(text, skipAscii ?? false)).toBe(result);
          });
          it('Unescaping', () => {
            expect(converter.unescape(result)).toBe(text);
          });
        });
      }
    });
  }
});
