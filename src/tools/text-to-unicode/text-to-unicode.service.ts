// regex that never matches
const SKIP_NOTHING_RE = /(\b\B)/;
export const SKIP_ASCII_JS = /([ -!#-&(-\[\]-~]+)/g;
export const SKIP_ASCII_HTML = /([ -!#-%(-;=?-~]+)/g;

function codeUnits(text: string): number[] {
  return text.split('').map(char => char.codePointAt(0));
}

function codePoints(text: string): number[] {
  return [...text].map(char => char.codePointAt(0));
}

export interface Converter {
  name: string
  escape(text: string, skipAscii: boolean): string
  unescape(text: string): string
};

interface EscapeConfig {
  charValues?(text: string): number[]
  mapper(charValue: number): string
  /** @prop regular expression for default content to skip. Must have exactly 1 capture group. */
  asciiSkipper: RegExp
};

function escaper({ charValues: getCharValues, mapper, asciiSkipper: skipper }: EscapeConfig) {
  return (text: string, skip: boolean): string => {
    getCharValues ??= codePoints;

    return text
      .split(skip ? skipper : SKIP_NOTHING_RE)
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
    escape: escaper({ mapper: convertCodePointToUnicode, asciiSkipper: SKIP_ASCII_JS }),
    unescape: unescaper({ regex: /\\u\p{AHex}{4}|\\u\{\p{AHex}{1,6}\}/gu, radix: 16 }),
  },
  utf16: {
    name: 'UTF-16 Code Units',
    escape: escaper({ charValues: codeUnits, mapper: convertCodePointToUnicode, asciiSkipper: SKIP_ASCII_JS }),
    unescape: unescaper({ regex: /\\u\p{AHex}{4}/gu, radix: 16 }),
  },
  hexEntities: {
    name: 'HTML Entities (Hex)',
    escape: escaper({ mapper: toHexEntities, asciiSkipper: SKIP_ASCII_HTML }),
    unescape: unescaper({ regex: /&#x\p{AHex}{1,6};/gu, radix: 16 }),
  },
  decimalEntities: {
    name: 'HTML Entities (Decimal)',
    escape: escaper({ mapper: toDecimalEntities, asciiSkipper: SKIP_ASCII_HTML }),
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
