const MAX_DISPLAY_FILE_NAME_GRAPHEMES = 160;
const REPLACEMENT_CHARACTER = '\uFFFD';
const VISIBLE_SPACE = '\u2420';

interface GraphemeSegmenter {
  segment: (value: string) => Iterable<unknown>
}

function isGraphemeSegmenter(value: unknown): value is GraphemeSegmenter {
  return typeof value === 'object'
    && value !== null
    && 'segment' in value
    && typeof value.segment === 'function';
}

function isUnsafeDisplayCodePoint(codePoint: number): boolean {
  return codePoint <= 0x1F
    || (codePoint >= 0x7F && codePoint <= 0x9F)
    || codePoint === 0x00AD
    || codePoint === 0x061C
    || (codePoint >= 0x200B && codePoint <= 0x200F)
    || (codePoint >= 0x2028 && codePoint <= 0x202E)
    || (codePoint >= 0x2060 && codePoint <= 0x206F)
    || (codePoint >= 0xD800 && codePoint <= 0xDFFF)
    || (codePoint >= 0xFFF9 && codePoint <= 0xFFFB)
    || codePoint === 0xFEFF;
}

function splitGraphemes(value: string): string[] {
  const SegmenterConstructor: unknown = Reflect.get(Intl, 'Segmenter');
  if (typeof SegmenterConstructor === 'function') {
    const candidate: unknown = Reflect.construct(
      SegmenterConstructor,
      [undefined, { granularity: 'grapheme' }],
    );
    if (isGraphemeSegmenter(candidate)) {
      const graphemes: string[] = [];
      for (const entry of candidate.segment(value)) {
        if (
          typeof entry !== 'object'
          || entry === null
          || !('segment' in entry)
          || typeof entry.segment !== 'string'
        ) {
          return Array.from(value);
        }
        graphemes.push(entry.segment);
      }
      return graphemes;
    }
  }

  return Array.from(value);
}

function sanitizeGrapheme(grapheme: string): string {
  let result = '';
  for (const character of grapheme) {
    const codePoint = character.codePointAt(0);
    result += codePoint === undefined || isUnsafeDisplayCodePoint(codePoint)
      ? REPLACEMENT_CHARACTER
      : character;
  }
  return result;
}

export function sanitizeFileNameForDisplay(fileName: string): string {
  if (!fileName.trim()) {
    return 'Unnamed file';
  }

  const graphemes = splitGraphemes(fileName);
  const firstVisibleGrapheme = graphemes.findIndex(grapheme => grapheme.trim() !== '');
  let lastVisibleGrapheme = firstVisibleGrapheme;
  for (let index = graphemes.length - 1; index >= firstVisibleGrapheme; index -= 1) {
    if (graphemes[index].trim() !== '') {
      lastVisibleGrapheme = index;
      break;
    }
  }
  const bounded = graphemes.slice(0, MAX_DISPLAY_FILE_NAME_GRAPHEMES);
  const sanitized = bounded.map((grapheme, index) => (
    (index < firstVisibleGrapheme || index > lastVisibleGrapheme) && grapheme.trim() === ''
      ? VISIBLE_SPACE
      : sanitizeGrapheme(grapheme)
  ));

  if (graphemes.length > MAX_DISPLAY_FILE_NAME_GRAPHEMES) {
    sanitized.push('…');
  }

  return sanitized.join('') || 'Unnamed file';
}
