// regex that never matches
const SKIP_NOTHING_RE = /(\b\B)/;
export const SKIP_ASCII_JS = /([ -!#-&(-\[\]-~]+)/g;
export const SKIP_ASCII_HTML = /([ -!#-%(-;=?-~]+)/g;

function codeUnits(text: string): number[] {
  return text.split('').map(char => char.codePointAt(0)!);
}

function codePoints(text: string): number[] {
  return [...text].map(char => char.codePointAt(0)!);
}

interface ConverterConfig {
  name: string
  escape: {
    charValues?(text: string): number[]
    mapper(charValue: number): string
    /** @prop regular expression for default content to skip. Must have exactly 1 capture group. */
    asciiSkipper: RegExp
  }
  unescape: {
    regex: RegExp
    radix: number
  }
}
class Converter {
  constructor(public config: ConverterConfig) {}

  escape(text: string, skipAscii: boolean): string {
    const { asciiSkipper, charValues, mapper } = this.config.escape;
    const getCharValues = charValues ?? codePoints;

    return text
      .split(skipAscii ? asciiSkipper : SKIP_NOTHING_RE)
      .flatMap((x, i) => i % 2 ? x : getCharValues(x).map(mapper))
      .join('');
  }

  unescape(escaped: string): string {
    const { regex, radix } = this.config.unescape;

    return escaped.replace(regex, (match) => {
      return String.fromCodePoint(Number.parseInt(match.replace(/\P{AHex}/gu, ''), radix));
    });
  }
}

export type ConverterId = keyof typeof converters;
const converters = {
  fullUnicode: new Converter({
    name: 'Full Unicode',
    escape: { mapper: convertCodePointToUnicode, asciiSkipper: SKIP_ASCII_JS },
    unescape: { regex: /\\u\p{AHex}{4}|\\u\{\p{AHex}{1,6}\}/gu, radix: 16 },
  }),
  utf16: new Converter({
    name: 'UTF-16 Code Units',
    escape: { charValues: codeUnits, mapper: convertCodePointToUnicode, asciiSkipper: SKIP_ASCII_JS },
    unescape: { regex: /\\u\p{AHex}{4}/gu, radix: 16 },
  }),
  hexEntities: new Converter({
    name: 'HTML Entities (Hex)',
    escape: { mapper: toHexEntities, asciiSkipper: SKIP_ASCII_HTML },
    unescape: { regex: /&#x\p{AHex}{1,6};/gu, radix: 16 },
  }),
  decimalEntities: new Converter({
    name: 'HTML Entities (Decimal)',
    escape: { mapper: toDecimalEntities, asciiSkipper: SKIP_ASCII_HTML },
    unescape: { regex: /&#\d+;/gu, radix: 10 },
  }),
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
