export interface CleanerOptions {
  stripLineNumbers: boolean
  removeAnsi: boolean
  stripBoxDrawing: boolean
  stripBulletMarkers: boolean
  trimTrailing: boolean
  collapseBlankLines: boolean
  normalizeIndent: boolean
  removeDiffMarkers: boolean
  smartUnwrap: boolean
  markdownMode: boolean
  unifyLineEndings: boolean
}

export interface CleanerStats {
  inputLines: number
  inputChars: number
  outputLines: number
  outputChars: number
  savedPercent: number
}

// ECMA-48 escape sequences, in this order:
// - OSC: ESC ] up to and including BEL or ESC \. The payload stops at the first ESC, so an unterminated OSC cannot scan the rest of the text.
// - CSI: ESC [ (or 0x9B), parameter bytes 0x30-0x3F, intermediate bytes 0x20-0x2F, one final byte 0x40-0x7E.
// - Other escapes: ESC, intermediate bytes 0x20-0x2F, one final byte 0x30-0x7E.
// eslint-disable-next-line no-control-regex
const ANSI_PATTERN = /\x1B\][^\x07\x1B]*(?:\x07|\x1B\\)|(?:\x1B\[|\x9B)[\x30-\x3F]*[\x20-\x2F]*[\x40-\x7E]|\x1B[\x20-\x2F]*[\x30-\x7E]/g;

const LINE_NUMBER_PREFIX = /^[ \t]*(\d{1,5})(?:\t| *[│|→] ?)/;

export const BULLET_CHARS = new Set(['●', '○', '◐', '◑', '◒', '◓', '◔', '◕', '⏺', '⏵', '▶', '▷', '►']);

const FENCE_LINE = /^\s*(`{3,}|~{3,})/;
const DIFF_HUNK_HEADER = /^@@ .*@@/;
const SENTENCE_END = /[.!?:;]$/;
const UNWRAP_STOP_START = /^(?:[-*•#]|\d+\.|`{3}|~{3}| {2}|\t)/;
const MARKDOWN_BLOCK_LINE = /^\s*(?:[-*+•]\s|\d+[.)]\s|#{1,6}(?:\s|$)|>|\|)/;

export function cleanText(input: string, options: CleanerOptions): string {
  let text = input;

  if (options.unifyLineEndings) {
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  if (options.removeAnsi) {
    text = removeAnsiSequences(text);
  }

  text = text.replace(/\xA0/g, ' ').replace(/\u200B/g, '');

  let lines = text.split('\n');

  if (options.stripLineNumbers) {
    lines = stripLineNumbers(lines);
  }
  if (options.stripBulletMarkers) {
    lines = lines.map(line => clearLeadingRegion(line, isBulletChar));
  }
  if (options.stripBoxDrawing) {
    lines = stripFrames(lines);
  }
  if (options.removeDiffMarkers) {
    lines = stripDiffMarkers(lines);
  }
  if (options.trimTrailing) {
    lines = lines.map(line => line.replace(/[ \t]+$/, ''));
  }
  if (options.normalizeIndent) {
    lines = removeCommonIndent(lines);
  }
  if (options.smartUnwrap) {
    lines = smartUnwrap(lines);
  }
  if (options.markdownMode) {
    lines = markdownReflow(lines);
  }
  if (options.collapseBlankLines) {
    lines = collapseBlankLines(lines);
  }

  return trimBlankLines(lines).join('\n');
}

export function computeStats(input: string, output: string): CleanerStats {
  const inputChars = input.length;
  const outputChars = output.length;

  return {
    inputLines: countLines(input),
    inputChars,
    outputLines: countLines(output),
    outputChars,
    savedPercent: inputChars === 0 ? 0 : Math.round(((inputChars - outputChars) / inputChars) * 100),
  };
}

export function removeAnsiSequences(text: string): string {
  return text.replace(ANSI_PATTERN, '');
}

export function stripLineNumbers(lines: string[]): string[] {
  const matches: { index: number; number: number; prefixLength: number }[] = [];

  lines.forEach((line, index) => {
    const match = LINE_NUMBER_PREFIX.exec(line);
    if (match) {
      matches.push({ index, number: Number(match[1]), prefixLength: match[0].length });
    }
  });

  const result = [...lines];

  matches.forEach((match, k) => {
    const continuesPrevious = matches[k - 1]?.number === match.number - 1;
    const continuesNext = matches[k + 1]?.number === match.number + 1;

    if (continuesPrevious || continuesNext) {
      result[match.index] = lines[match.index].slice(match.prefixLength);
    }
  });

  return result;
}

// The leading region is the longest prefix made only of whitespace and characters accepted by `isMarker`.
// Each marker character in that region becomes one space, so code columns keep their alignment.
export function clearLeadingRegion(line: string, isMarker: (char: string) => boolean): string {
  let region = '';
  let regionLength = 0;

  for (const char of line) {
    if (isMarker(char)) {
      region += ' ';
    }
    else if (isWhitespace(char)) {
      region += char;
    }
    else {
      break;
    }
    regionLength += char.length;
  }

  return region + line.slice(regionLength);
}

export function stripFrames(lines: string[]): string[] {
  return lines.map((line) => {
    const chars = [...line];
    const hasFrameChar = chars.some(isFrameChar);

    if (!hasFrameChar) {
      return line;
    }

    if (chars.every(char => isFrameChar(char) || isWhitespace(char))) {
      return '';
    }

    let end = chars.length;
    while (end > 0 && (isFrameChar(chars[end - 1]) || isWhitespace(chars[end - 1]))) {
      end--;
    }
    const trailingRegion = chars.slice(end);
    const body = trailingRegion.some(isFrameChar) ? chars.slice(0, end).join('') : line;

    return clearLeadingRegion(body, isFrameChar);
  });
}

export function stripDiffMarkers(lines: string[]): string[] {
  const result: string[] = [];
  let inHunk = false;

  for (const line of lines) {
    if (DIFF_HUNK_HEADER.test(line)) {
      inHunk = true;
      continue;
    }

    if (inHunk) {
      if (line === '') {
        result.push(line);
        continue;
      }

      const marker = line[0];
      if (marker === '+' || marker === ' ') {
        result.push(line.slice(1));
        continue;
      }
      if (marker === '-' || marker === '\\') {
        continue;
      }

      inHunk = false;
    }

    result.push(/^[+-](?![+-])/.test(line) ? line.slice(1) : line);
  }

  return result;
}

export function removeCommonIndent(lines: string[]): string[] {
  let commonIndent: string | undefined;

  for (const line of lines) {
    if (isBlank(line)) {
      continue;
    }

    const indent = /^[ \t]*/.exec(line)?.[0] ?? '';
    commonIndent = commonIndent === undefined ? indent : commonPrefix(commonIndent, indent);

    if (commonIndent === '') {
      return lines;
    }
  }

  if (!commonIndent) {
    return lines;
  }

  const indent = commonIndent;
  return lines.map(line => (line.startsWith(indent) ? line.slice(indent.length) : line));
}

export function smartUnwrap(lines: string[]): string[] {
  const result: string[] = [];
  const fence = createFenceTracker();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (fence.update(line)) {
      result.push(line);
      index++;
      continue;
    }

    let paragraph = line;
    let lastLine = line;

    while (index + 1 < lines.length && canJoin(lastLine, lines[index + 1])) {
      const nextLine = lines[index + 1];
      paragraph = `${paragraph.replace(/\s+$/, '')} ${nextLine.replace(/^\s+/, '')}`;
      lastLine = nextLine;
      index++;
    }

    result.push(paragraph);
    index++;
  }

  return result;
}

export function markdownReflow(lines: string[]): string[] {
  const result: string[] = [];
  const fence = createFenceTracker();
  let paragraph: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) {
      return;
    }

    if (paragraph.some(line => MARKDOWN_BLOCK_LINE.test(line))) {
      result.push(...paragraph.map(line => line.replace(/^\s+/, '')));
    }
    else {
      result.push(paragraph.map(line => line.trim()).join(' '));
    }

    paragraph = [];
  }

  for (const line of lines) {
    if (fence.update(line)) {
      flushParagraph();
      result.push(line);
      continue;
    }

    if (isBlank(line)) {
      flushParagraph();
      result.push(line);
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();

  return result;
}

function collapseBlankLines(lines: string[]): string[] {
  return lines.filter((line, index) => !(isBlank(line) && index > 0 && isBlank(lines[index - 1])));
}

function trimBlankLines(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;

  while (start < end && isBlank(lines[start])) {
    start++;
  }
  while (end > start && isBlank(lines[end - 1])) {
    end--;
  }

  return lines.slice(start, end);
}

function canJoin(line: string, nextLine: string): boolean {
  return !isBlank(line)
    && !isBlank(nextLine)
    && !SENTENCE_END.test(line.replace(/\s+$/, ''))
    && !UNWRAP_STOP_START.test(nextLine)
    && !FENCE_LINE.test(nextLine);
}

// Tracks whether a line sits inside a fenced code block.
// `update` returns true when the line is a fence line or lies inside a fence.
function createFenceTracker() {
  let openMarker: string | undefined;

  return {
    update(line: string): boolean {
      const marker = FENCE_LINE.exec(line)?.[1];

      if (openMarker === undefined) {
        if (marker) {
          openMarker = marker;
          return true;
        }
        return false;
      }

      if (marker && marker[0] === openMarker[0] && marker.length >= openMarker.length) {
        openMarker = undefined;
      }
      return true;
    },
  };
}

function countLines(text: string): number {
  return text === '' ? 0 : text.split(/\r\n|\r|\n/).length;
}

function commonPrefix(a: string, b: string): string {
  let length = 0;
  while (length < a.length && length < b.length && a[length] === b[length]) {
    length++;
  }
  return a.slice(0, length);
}

function isBlank(line: string): boolean {
  return line.trim() === '';
}

function isWhitespace(char: string): boolean {
  return /^\s$/.test(char);
}

function isBulletChar(char: string): boolean {
  return BULLET_CHARS.has(char);
}

// U+2500 to U+259F: box drawing and block elements. Arrows and geometric shapes are not frame characters.
function isFrameChar(char: string): boolean {
  const codePoint = char.codePointAt(0) ?? 0;
  return codePoint >= 0x2500 && codePoint <= 0x259F;
}
