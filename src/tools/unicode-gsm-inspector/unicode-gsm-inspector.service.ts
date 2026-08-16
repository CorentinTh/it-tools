export const UNICODE_INSPECTOR_MAX_INPUT_BYTES = 64 * 1024;
export const UNICODE_INSPECTOR_MAX_CODE_POINTS = 4_096;
export const UNICODE_INSPECTOR_MAX_SEARCH_CHARACTERS = 64;

const GSM_BASIC = new Set(Array.from('@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà'));
const GSM_EXTENSION = new Set(Array.from('\f^{}\\[~]|€'));

export interface UnicodeInspection {
  report: string
  codePointCount: number
  utf8Bytes: number
  utf16Units: number
  graphemeCount?: number
  smsEncoding: 'GSM-7' | 'UCS-2'
  smsUnits: number
  smsSegments: number
  matches: number
}

function utf8Length(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function graphemeCount(value: string): number | undefined {
  interface SegmenterLike {
    segment: (input: string) => Iterable<unknown>
  }
  type SegmenterConstructor = new (locale?: string | string[], options?: { granularity: 'grapheme' }) => SegmenterLike;
  const Segmenter = (Intl as typeof Intl & { Segmenter?: SegmenterConstructor }).Segmenter;
  if (!Segmenter) {
    return undefined;
  }
  return [...new Segmenter(undefined, { granularity: 'grapheme' }).segment(value)].length;
}

function codePointLabel(character: string): string {
  return `U+${character.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`;
}

function visibleCharacter(character: string): string {
  switch (character) {
    case '\n': return 'LF';
    case '\r': return 'CR';
    case '\t': return 'TAB';
    case '\f': return 'FORM FEED';
    case ' ': return 'SPACE';
    default: return /\p{C}/u.test(character) ? '(control/format)' : character;
  }
}

function parseNeedle(search: string): { literal?: string; codePoint?: number } {
  const trimmed = search.trim();
  if (!trimmed) {
    return {};
  }
  const match = /^(?:U\+|0x)?([0-9a-f]{1,6})$/iu.exec(trimmed);
  if (match) {
    const codePoint = Number.parseInt(match[1], 16);
    if (codePoint <= 0x10_FFFF && !(codePoint >= 0xD800 && codePoint <= 0xDFFF)) {
      return { codePoint };
    }
  }
  return { literal: trimmed.normalize('NFC') };
}

function countOccurrences(source: string, needle: string): number {
  if (!needle) {
    return 0;
  }
  let count = 0;
  let offset = 0;
  let match = source.indexOf(needle, offset);
  while (match >= 0) {
    count += 1;
    offset = match + Math.max(needle.length, 1);
    match = source.indexOf(needle, offset);
  }
  return count;
}

function smsMetrics(characters: string[]): Pick<UnicodeInspection, 'smsEncoding' | 'smsUnits' | 'smsSegments'> {
  let septets = 0;
  for (const character of characters) {
    if (GSM_BASIC.has(character)) {
      septets += 1;
    }
    else if (GSM_EXTENSION.has(character)) {
      septets += 2;
    }
    else {
      const units = characters.join('').length;
      return { smsEncoding: 'UCS-2', smsUnits: units, smsSegments: units === 0 ? 0 : units <= 70 ? 1 : Math.ceil(units / 67) };
    }
  }
  return { smsEncoding: 'GSM-7', smsUnits: septets, smsSegments: septets === 0 ? 0 : septets <= 160 ? 1 : Math.ceil(septets / 153) };
}

export function inspectUnicodeText(source: string, search = ''): UnicodeInspection {
  if (utf8Length(source) > UNICODE_INSPECTOR_MAX_INPUT_BYTES) {
    throw new RangeError('Text is limited to 64 KiB of UTF-8 data.');
  }
  if (search.length > UNICODE_INSPECTOR_MAX_SEARCH_CHARACTERS) {
    throw new RangeError('Search is limited to 64 characters.');
  }
  const characters = Array.from(source);
  if (characters.length > UNICODE_INSPECTOR_MAX_CODE_POINTS) {
    throw new RangeError('Inspection is limited to 4,096 Unicode code points.');
  }
  const needle = parseNeedle(search);
  const rows: string[] = [];
  let utf16Offset = 0;
  let utf8Offset = 0;
  let matches = 0;
  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index];
    const point = character.codePointAt(0)!;
    const normalizedCharacter = character.normalize('NFC');
    const matched = needle.codePoint === point || (needle.literal !== undefined && normalizedCharacter.includes(needle.literal));
    if (matched) {
      matches += 1;
    }
    const gsm = GSM_BASIC.has(character) ? 'basic ×1' : GSM_EXTENSION.has(character) ? 'extension ×2' : 'not GSM-7';
    rows.push(`${matched ? '>' : ' '} ${String(index).padStart(4, ' ')} | UTF-16 ${String(utf16Offset).padStart(4, ' ')} | UTF-8 ${String(utf8Offset).padStart(5, ' ')} | ${codePointLabel(character).padEnd(9, ' ')} | ${visibleCharacter(character)} | ${gsm}`);
    utf16Offset += character.length;
    utf8Offset += utf8Length(character);
  }
  if (needle.literal !== undefined) {
    matches = countOccurrences(source.normalize('NFC'), needle.literal);
  }
  const graphemes = graphemeCount(source);
  const sms = smsMetrics(characters);
  const normalizedNfc = source.normalize('NFC');
  const normalizedNfd = source.normalize('NFD');
  const report = [
    `Code points: ${characters.length.toLocaleString('en-US')}`,
    `UTF-16 code units: ${source.length.toLocaleString('en-US')}`,
    `UTF-8 bytes: ${utf8Offset.toLocaleString('en-US')}`,
    `Grapheme clusters: ${graphemes?.toLocaleString('en-US') ?? 'unavailable in this browser'}`,
    `NFC changes input: ${normalizedNfc !== source ? 'yes' : 'no'}`,
    `NFD changes input: ${normalizedNfd !== source ? 'yes' : 'no'}`,
    `SMS encoding estimate: ${sms.smsEncoding}; ${sms.smsUnits.toLocaleString('en-US')} ${sms.smsEncoding === 'GSM-7' ? 'septets' : 'UTF-16 units'}; ${sms.smsSegments.toLocaleString('en-US')} segment(s)`,
    `Search matches: ${matches.toLocaleString('en-US')}`,
    '',
    '  index | offsets | code point | character | GSM-7 membership',
    ...rows,
  ].join('\n');
  return { report, codePointCount: characters.length, utf8Bytes: utf8Offset, utf16Units: source.length, graphemeCount: graphemes, ...sms, matches };
}
