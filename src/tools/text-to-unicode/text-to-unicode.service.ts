// regex that never matches
const SKIP_NOTHING_RE = /(\b\B)/;
export const SKIP_PRINTABLE_ASCII_RE = /([ -~]+)/g;

function _codeUnits(text: string): number[] {
  return text.split('').map(char => char.codePointAt(0));
}

function _codePoints(text: string): number[] {
  return [...text].map(char => char.codePointAt(0));
}

export interface Converter {
  name: string
  escape(text: string, skip: RegExp): string
  unescape(text: string): string
};

interface EscapeConfig {
  getCharValues?(text: string): number[]
  mapper(charValue: number): string
};

function escaper({ getCharValues, mapper }: EscapeConfig) {
  /**
   * @param text text input to escape
   * @param skipper regular expression for content _not_ to escape. Must have exactly 1 capture group.
   */
  return (text: string, skipper?: RegExp): string => {
    skipper ??= SKIP_NOTHING_RE;
    getCharValues ??= _codePoints;

    return text
      .split(skipper)
      .flatMap((x, i) => {
        if (i % 2) {
          return x;
        }
        return getCharValues(x).map(mapper);
      })
      .join('');
  };
}

interface UnescapeConfig {
  regex: RegExp
  radix: number
};

function unescaper({ regex, radix }: UnescapeConfig) {
  return (escaped: string): string => {
    return escaped.replace(regex, (match) => {
      return String.fromCodePoint(Number.parseInt(match.replace(/\P{AHex}/gu, ''), radix));
    });
  };
}

export type ConverterId = keyof typeof converters;
const converters = {
  fullUnicode: {
    name: 'Full Unicode',
    escape: escaper({ mapper: convertCodePointToUnicode }),
    unescape: unescaper({ regex: /\\u\p{AHex}{4}|\\u\{\p{AHex}{1,6}\}/gu, radix: 16 }),
  },
  utf16: {
    name: 'UTF-16 Code Units',
    escape: escaper({ getCharValues: _codeUnits, mapper: convertCodePointToUnicode }),
    unescape: unescaper({ regex: /\\u\p{AHex}{4}/gu, radix: 16 }),
  },
  hexEntities: {
    name: 'HTML Entities (Hex)',
    escape: escaper({ mapper: toHexEntities }),
    unescape: unescaper({ regex: /&#x\p{AHex}{1,6};/gu, radix: 16 }),
  },
  decimalEntities: {
    name: 'HTML Entities (Decimal)',
    escape: escaper({ mapper: toDecimalEntities }),
    unescape: unescaper({ regex: /&#\d+;/gu, radix: 10 }),
  },
} satisfies Record<string, Converter>;

function convertCodePointToUnicode(codePoint: number): string {
  const hex = codePoint.toString(16);
  return hex.length > 4 ? String.raw`\u{${hex}}` : String.raw`\u${hex.padStart(4, '0')}`;
}

function toHexEntities(codePoint: number): string {
  return `&#x${codePoint.toString(16)};`;
}

function toDecimalEntities(codePoint: number): string {
  return `&#${codePoint};`;
}

export { converters };
