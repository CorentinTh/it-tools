export interface IdnInspection {
  ascii: string
  unicode: string
  warnings: string[]
}

const BASE = 36;
const T_MIN = 1;
const T_MAX = 26;
const SKEW = 38;
const DAMP = 700;
const INITIAL_BIAS = 72;
const INITIAL_N = 128;
const MAX_DOMAIN_CHARACTERS = 1024;

function adapt(deltaValue: number, pointCount: number, firstTime: boolean): number {
  let delta = firstTime ? Math.floor(deltaValue / DAMP) : deltaValue >> 1;
  delta += Math.floor(delta / pointCount);
  let k = 0;
  while (delta > Math.floor(((BASE - T_MIN) * T_MAX) / 2)) {
    delta = Math.floor(delta / (BASE - T_MIN));
    k += BASE;
  }
  return k + Math.floor(((BASE - T_MIN + 1) * delta) / (delta + SKEW));
}

function digitToBasic(digit: number): string {
  return String.fromCharCode(digit + 22 + 75 * Number(digit < 26));
}

function basicToDigit(codePoint: number): number {
  if (codePoint >= 48 && codePoint <= 57) {
    return codePoint - 22;
  }
  if (codePoint >= 65 && codePoint <= 90) {
    return codePoint - 65;
  }
  if (codePoint >= 97 && codePoint <= 122) {
    return codePoint - 97;
  }
  return BASE;
}

export function encodePunycode(input: string): string {
  const points = Array.from(input.normalize('NFC'), character => character.codePointAt(0)!);
  let output = '';
  for (const point of points) {
    if (point < 128) {
      output += String.fromCodePoint(point);
    }
  }
  const basicLength = output.length;
  let handled = basicLength;
  if (basicLength > 0) {
    output += '-';
  }
  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;
  while (handled < points.length) {
    let next = Number.MAX_SAFE_INTEGER;
    for (const point of points) {
      if (point >= n && point < next) {
        next = point;
      }
    }
    if (!Number.isSafeInteger(next) || next > 0x10_FFFF || (next - n) > Math.floor((Number.MAX_SAFE_INTEGER - delta) / (handled + 1))) {
      throw new RangeError('The Unicode label is too large to encode safely.');
    }
    delta += (next - n) * (handled + 1);
    n = next;
    for (const point of points) {
      if (point < n) {
        delta += 1;
      }
      if (point !== n) {
        continue;
      }
      let q = delta;
      for (let k = BASE; ; k += BASE) {
        const threshold = k <= bias ? T_MIN : k >= bias + T_MAX ? T_MAX : k - bias;
        if (q < threshold) {
          break;
        }
        output += digitToBasic(threshold + ((q - threshold) % (BASE - threshold)));
        q = Math.floor((q - threshold) / (BASE - threshold));
      }
      output += digitToBasic(q);
      bias = adapt(delta, handled + 1, handled === basicLength);
      delta = 0;
      handled += 1;
    }
    delta += 1;
    n += 1;
  }
  return output;
}

export function decodePunycode(input: string): string {
  if (!/^[A-Za-z0-9-]+$/u.test(input)) {
    throw new TypeError('Punycode labels may contain only ASCII letters, digits, and hyphens.');
  }
  const output: number[] = [];
  const delimiter = input.lastIndexOf('-');
  let index = delimiter >= 0 ? delimiter + 1 : 0;
  if (delimiter >= 0) {
    for (const character of input.slice(0, delimiter)) {
      const point = character.codePointAt(0)!;
      if (point >= 128) {
        throw new TypeError('The basic Punycode prefix must be ASCII.');
      }
      output.push(point);
    }
  }
  let n = INITIAL_N;
  let insertedIndex = 0;
  let bias = INITIAL_BIAS;
  while (index < input.length) {
    const oldIndex = insertedIndex;
    let weight = 1;
    for (let k = BASE; ; k += BASE) {
      if (index >= input.length) {
        throw new TypeError('The Punycode label is truncated.');
      }
      const digit = basicToDigit(input.codePointAt(index++)!);
      if (digit >= BASE || digit > Math.floor((Number.MAX_SAFE_INTEGER - insertedIndex) / weight)) {
        throw new TypeError('The Punycode label is invalid.');
      }
      insertedIndex += digit * weight;
      const threshold = k <= bias ? T_MIN : k >= bias + T_MAX ? T_MAX : k - bias;
      if (digit < threshold) {
        break;
      }
      const multiplier = BASE - threshold;
      if (weight > Math.floor(Number.MAX_SAFE_INTEGER / multiplier)) {
        throw new RangeError('The Punycode label is too large.');
      }
      weight *= multiplier;
    }
    const length = output.length + 1;
    bias = adapt(insertedIndex - oldIndex, length, oldIndex === 0);
    const increment = Math.floor(insertedIndex / length);
    if (increment > 0x10_FFFF - n) {
      throw new TypeError('The Punycode label contains an invalid Unicode code point.');
    }
    n += increment;
    insertedIndex %= length;
    if (n >= 0xD800 && n <= 0xDFFF) {
      throw new TypeError('The Punycode label decodes to an invalid surrogate code point.');
    }
    output.splice(insertedIndex, 0, n);
    insertedIndex += 1;
  }
  return String.fromCodePoint(...output).normalize('NFC');
}

function normalizeDomain(source: string): { labels: string[]; trailingDot: boolean } {
  const trimmed = source.trim().replace(/[。．｡]/gu, '.');
  if (!trimmed || trimmed.length > MAX_DOMAIN_CHARACTERS || /[\s\p{Control}/@:?#\\]/u.test(trimmed)) {
    throw new TypeError('Enter one domain name without a URL scheme, path, port, whitespace, or control characters.');
  }
  const trailingDot = trimmed.endsWith('.');
  const labels = (trailingDot ? trimmed.slice(0, -1) : trimmed).split('.');
  if (labels.some(label => !label)) {
    throw new TypeError('Domain labels cannot be empty.');
  }
  return { labels, trailingDot };
}

function validateAsciiLabel(label: string): string {
  const normalized = label.toLowerCase();
  if (!/^[a-z0-9-]+$/u.test(normalized) || normalized.startsWith('-') || normalized.endsWith('-') || normalized.length > 63) {
    throw new TypeError(`Invalid DNS label: “${label.slice(0, 64)}”. Labels must be 1–63 ASCII bytes and cannot start or end with a hyphen.`);
  }
  return normalized;
}

function toAsciiLabel(label: string): string {
  const normalized = label.normalize('NFC');
  if (!normalized || /[\s\p{Control}/@:?#\\]/u.test(normalized)) {
    throw new TypeError('Unicode domain labels cannot contain whitespace, controls, or URL delimiters.');
  }
  if (/^\p{ASCII}+$/u.test(normalized)) {
    return validateAsciiLabel(normalized);
  }
  const encoded = validateAsciiLabel(`xn--${encodePunycode(normalized)}`);
  return encoded;
}

function scriptOf(character: string): string | undefined {
  if (!/\p{Letter}/u.test(character)) {
    return undefined;
  }
  const scripts: Array<[string, RegExp]> = [
    ['Latin', /\p{Script=Latin}/u], ['Cyrillic', /\p{Script=Cyrillic}/u], ['Greek', /\p{Script=Greek}/u],
    ['Han', /\p{Script=Han}/u], ['Hiragana', /\p{Script=Hiragana}/u], ['Katakana', /\p{Script=Katakana}/u],
    ['Arabic', /\p{Script=Arabic}/u], ['Hebrew', /\p{Script=Hebrew}/u], ['Devanagari', /\p{Script=Devanagari}/u],
  ];
  return scripts.find(([, pattern]) => pattern.test(character))?.[0] ?? 'Other';
}

function safetyWarnings(unicodeLabels: string[], sourceLabels: string[]): string[] {
  const warnings = new Set<string>();
  const confusables = /[\u0430\u0435\u043E\u0440\u0441\u0443\u0445\u0456\u0458\u03B1\u03BF\u03C1\u03C7]/u;
  unicodeLabels.forEach((label, index) => {
    const scripts = new Set(Array.from(label, scriptOf).filter((value): value is string => Boolean(value)));
    if (scripts.size > 1) {
      warnings.add(`Label ${index + 1} mixes scripts: ${[...scripts].join(', ')}.`);
    }
    if (confusables.test(label)) {
      warnings.add(`Label ${index + 1} contains characters commonly confusable with Latin letters.`);
    }
    if (/[\p{Symbol}\p{Emoji_Presentation}]/u.test(label)) {
      warnings.add(`Label ${index + 1} contains symbols or emoji; registries and IDNA profiles may reject it.`);
    }
  });
  if (sourceLabels.some(label => /^xn--/iu.test(label))) {
    warnings.add('The input contains an ACE/Punycode label; verify the decoded Unicode before following links.');
  }
  return [...warnings];
}

export function inspectIdn(source: string): IdnInspection {
  const { labels, trailingDot } = normalizeDomain(source);
  const unicodeLabels = labels.map((label) => {
    if (!/^xn--/iu.test(label)) {
      return label.normalize('NFC');
    }
    const decoded = decodePunycode(label.slice(4));
    if (toAsciiLabel(decoded) !== label.toLowerCase()) {
      throw new TypeError(`Punycode label “${label.slice(0, 64)}” is not canonical.`);
    }
    return decoded;
  });
  const asciiLabels = unicodeLabels.map(toAsciiLabel);
  const ascii = `${asciiLabels.join('.')}${trailingDot ? '.' : ''}`;
  if (ascii.length > 253 + Number(trailingDot)) {
    throw new RangeError('The encoded domain exceeds the 253-byte DNS name limit.');
  }
  return {
    ascii,
    unicode: `${unicodeLabels.join('.')}${trailingDot ? '.' : ''}`,
    warnings: safetyWarnings(unicodeLabels, labels),
  };
}
