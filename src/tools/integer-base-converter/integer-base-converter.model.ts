export const INTEGER_BASE_MIN = 2;
export const INTEGER_BASE_MAX = 64;
export const INTEGER_INPUT_MAX_LENGTH = 4096;

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/';
const CASE_INSENSITIVE_ALPHABET = ALPHABET.slice(0, 36);
const CONVENTIONAL_PREFIX_BASES = new Map<string, number>([
  ['b', 2],
  ['o', 8],
  ['d', 10],
  ['x', 16],
]);
const CONVENTIONAL_SUFFIX_BASES = new Map<string, number>([
  ['b', 2],
  ['o', 8],
  ['d', 10],
  ['h', 16],
]);

function assertBase(base: number, label: string): void {
  if (!Number.isSafeInteger(base) || base < INTEGER_BASE_MIN || base > INTEGER_BASE_MAX) {
    throw new RangeError(`${label} must be an integer from ${INTEGER_BASE_MIN} to ${INTEGER_BASE_MAX}.`);
  }
}

function digitValue(character: string, base: number): number {
  const index = base <= 36
    ? CASE_INSENSITIVE_ALPHABET.indexOf(character.toLowerCase())
    : ALPHABET.indexOf(character);

  return index >= 0 && index < base ? index : -1;
}

function stripConventionalNotation(value: string, base: number): { digits: string; negative: boolean } {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error('Input number is empty.');
  }
  if (trimmed.length > INTEGER_INPUT_MAX_LENGTH) {
    throw new Error(`Input number must be at most ${INTEGER_INPUT_MAX_LENGTH} characters.`);
  }

  const negative = trimmed.startsWith('-');
  const unsigned = /^[+-]/.test(trimmed) ? trimmed.slice(1) : trimmed;
  if (!unsigned) {
    throw new Error('Input number must contain at least one digit.');
  }

  let digits = unsigned;
  let usedPrefix = false;

  if ([2, 8, 10, 16].includes(base) && /^0[bBdDoOxX]/.test(digits)) {
    const marker = digits[1].toLowerCase();
    const requiredBase = CONVENTIONAL_PREFIX_BASES.get(marker);
    if (requiredBase !== base) {
      throw new Error(`Prefix 0${marker} requires input base ${requiredBase}.`);
    }
    digits = digits.slice(2);
    usedPrefix = true;
  }

  const suffix = digits.at(-1)?.toLowerCase() ?? '';
  const suffixBase = CONVENTIONAL_SUFFIX_BASES.get(suffix);
  if (suffixBase !== undefined && digitValue(digits.at(-1) ?? '', base) < 0) {
    if (suffixBase !== base) {
      throw new Error(`Suffix ${suffix} requires input base ${suffixBase}.`);
    }
    if (usedPrefix) {
      throw new Error('Use either a base prefix or a suffix, not both.');
    }
    digits = digits.slice(0, -1);
  }

  if (!digits) {
    throw new Error('Input number must contain at least one digit.');
  }
  if (/\s/.test(digits)) {
    throw new Error('Whitespace is not allowed inside an integer.');
  }

  return { digits, negative };
}

export function parseInteger({ value, base }: { value: string; base: number }): bigint {
  assertBase(base, 'Input base');
  const { digits, negative } = stripConventionalNotation(value, base);
  let result = 0n;
  const radix = BigInt(base);

  for (const digit of digits) {
    const numericValue = digitValue(digit, base);
    if (numericValue < 0) {
      throw new Error(`Invalid digit "${digit}" for base ${base}.`);
    }
    result = result * radix + BigInt(numericValue);
  }

  return negative && result !== 0n ? -result : result;
}

export function formatInteger({ value, base }: { value: bigint; base: number }): string {
  assertBase(base, 'Output base');
  if (value === 0n) {
    return '0';
  }

  const negative = value < 0n;
  let remaining = negative ? -value : value;
  const radix = BigInt(base);
  let output = '';

  while (remaining > 0n) {
    output = ALPHABET[Number(remaining % radix)] + output;
    remaining /= radix;
  }

  return negative ? `-${output}` : output;
}

export function convertBase({ value, fromBase, toBase }: { value: string; fromBase: number; toBase: number }) {
  return formatInteger({ value: parseInteger({ value, base: fromBase }), base: toBase });
}
