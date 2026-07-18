import type { RandomValuesProvider } from '@/utils/secure-random';
import { secureRandomString } from '@/utils/secure-random';

export const DEFAULT_NANOID_ALPHABET = '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DEFAULT_NANOID_LENGTH = 21;
export const DEFAULT_NANOID_QUANTITY = 1;
export const MIN_NANOID_ALPHABET_SIZE = 2;
export const MAX_NANOID_ALPHABET_SIZE = 256;
export const MAX_NANOID_ALPHABET_CODE_UNITS = MAX_NANOID_ALPHABET_SIZE * 2;
export const MAX_NANOID_LENGTH = 512;
export const MAX_NANOID_QUANTITY = 10_000;
export const MAX_NANOID_TOTAL_SYMBOLS = 100_000;
export const MAX_NANOID_OUTPUT_BYTES = 512 * 1024;

const NATURAL_LOG_OF_TEN = Math.log(10);

export interface NanoIdOptions {
  alphabet: string
  length: number
  quantity: number
}

export interface NanoIdValidation {
  isValid: boolean
  message?: string
  alphabetSize: number
  totalSymbols: number
  maximumOutputBytes: number
}

export interface NanoIdBatch {
  ids: string[]
  text: string
  outputBytes: number
}

export interface ScientificNumber {
  mantissa: number
  exponent: number
}

export interface NanoIdCollisionMetrics {
  alphabetSize: number
  entropyBits: number
  namespaceSize: ScientificNumber
  collisionProbability: number
  collisionProbabilityScientific?: ScientificNumber
  onePercentCollisionCount: ScientificNumber
}

export function parseNanoIdCountInput(value: string, maximum: number): number {
  const maximumCharacters = String(maximum).length;
  if (value.length === 0 || value.length > maximumCharacters || !/^\d+$/.test(value)) {
    return Number.NaN;
  }

  return Number(value);
}

function hasLoneSurrogate(value: string) {
  for (let index = 0; index < value.length; index++) {
    const codeUnit = value.charCodeAt(index);

    if (codeUnit >= 0xD800 && codeUnit <= 0xDBFF) {
      const nextCodeUnit = value.charCodeAt(index + 1);
      if (nextCodeUnit < 0xDC00 || nextCodeUnit > 0xDFFF) {
        return true;
      }
      index++;
    }
    else if (codeUnit >= 0xDC00 && codeUnit <= 0xDFFF) {
      return true;
    }
  }

  return false;
}

function hasControlOrLineSeparator(value: string) {
  return Array.from(value).some((symbol) => {
    const codePoint = symbol.codePointAt(0);

    return codePoint !== undefined && (
      codePoint <= 0x1F
      || (codePoint >= 0x7F && codePoint <= 0x9F)
      || codePoint === 0x2028
      || codePoint === 0x2029
    );
  });
}

function invalidValidation(message: string, alphabetSize = 0): NanoIdValidation {
  return { isValid: false, message, alphabetSize, totalSymbols: 0, maximumOutputBytes: 0 };
}

export function validateNanoIdOptions({ alphabet, length, quantity }: NanoIdOptions): NanoIdValidation {
  if (!Number.isSafeInteger(length) || length < 1 || length > MAX_NANOID_LENGTH) {
    return invalidValidation(`Length must be a whole number between 1 and ${MAX_NANOID_LENGTH}.`);
  }

  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_NANOID_QUANTITY) {
    return invalidValidation(`Quantity must be a whole number between 1 and ${MAX_NANOID_QUANTITY}.`);
  }

  if (alphabet.length > MAX_NANOID_ALPHABET_CODE_UNITS) {
    return invalidValidation(
      `Alphabet must contain between ${MIN_NANOID_ALPHABET_SIZE} and ${MAX_NANOID_ALPHABET_SIZE} symbols.`,
      MAX_NANOID_ALPHABET_SIZE + 1,
    );
  }

  if (hasLoneSurrogate(alphabet)) {
    return invalidValidation('Alphabet must not contain an unpaired Unicode surrogate.');
  }

  if (hasControlOrLineSeparator(alphabet)) {
    return invalidValidation('Alphabet must not contain control or line-separator characters.');
  }

  if (alphabet.normalize('NFC') !== alphabet) {
    return invalidValidation('Alphabet must use NFC-normalized Unicode characters.');
  }

  const symbols = Array.from(alphabet);
  const alphabetSize = symbols.length;

  if (alphabetSize < MIN_NANOID_ALPHABET_SIZE || alphabetSize > MAX_NANOID_ALPHABET_SIZE) {
    return invalidValidation(
      `Alphabet must contain between ${MIN_NANOID_ALPHABET_SIZE} and ${MAX_NANOID_ALPHABET_SIZE} symbols.`,
      alphabetSize,
    );
  }

  if (new Set(symbols).size !== alphabetSize) {
    return invalidValidation('Alphabet symbols must be unique.', alphabetSize);
  }

  const totalSymbols = length * quantity;
  if (totalSymbols > MAX_NANOID_TOTAL_SYMBOLS) {
    return invalidValidation(
      `Length × quantity must not exceed ${MAX_NANOID_TOTAL_SYMBOLS.toLocaleString('en-US')} symbols.`,
      alphabetSize,
    );
  }

  const encoder = new TextEncoder();
  const maximumSymbolBytes = Math.max(...symbols.map(symbol => encoder.encode(symbol).byteLength));
  const maximumOutputBytes = totalSymbols * maximumSymbolBytes + quantity - 1;

  if (maximumOutputBytes > MAX_NANOID_OUTPUT_BYTES) {
    return invalidValidation(
      `The worst-case UTF-8 output must not exceed ${MAX_NANOID_OUTPUT_BYTES.toLocaleString('en-US')} bytes.`,
      alphabetSize,
    );
  }

  return { isValid: true, alphabetSize, totalSymbols, maximumOutputBytes };
}

export function generateNanoIdBatch({
  alphabet,
  length,
  quantity,
  getRandomValues,
}: NanoIdOptions & { getRandomValues?: RandomValuesProvider }): NanoIdBatch {
  const validation = validateNanoIdOptions({ alphabet, length, quantity });
  if (!validation.isValid) {
    throw new RangeError(validation.message);
  }

  const randomSymbols = Array.from(secureRandomString({
    alphabet,
    length: validation.totalSymbols,
    getRandomValues,
  }));
  const ids = Array.from({ length: quantity }, (_unused, index) => (
    randomSymbols.slice(index * length, (index + 1) * length).join('')
  ));
  const text = ids.join('\n');
  const outputBytes = new TextEncoder().encode(text).byteLength;

  if (outputBytes > MAX_NANOID_OUTPUT_BYTES) {
    throw new RangeError(`Generated output exceeds ${MAX_NANOID_OUTPUT_BYTES} UTF-8 bytes.`);
  }

  return { ids, text, outputBytes };
}

function toScientificNumber(naturalLog: number): ScientificNumber {
  let exponent = Math.floor(naturalLog / NATURAL_LOG_OF_TEN);
  let mantissa = Math.exp(naturalLog - exponent * NATURAL_LOG_OF_TEN);

  if (mantissa >= 10) {
    mantissa /= 10;
    exponent++;
  }

  return { mantissa, exponent };
}

export function calculateNanoIdCollisionMetrics({
  alphabetSize,
  length,
  sampleCount,
}: {
  alphabetSize: number
  length: number
  sampleCount: number
}): NanoIdCollisionMetrics {
  if (!Number.isSafeInteger(alphabetSize)
    || alphabetSize < MIN_NANOID_ALPHABET_SIZE
    || alphabetSize > MAX_NANOID_ALPHABET_SIZE) {
    throw new RangeError(
      `Alphabet size must be between ${MIN_NANOID_ALPHABET_SIZE} and ${MAX_NANOID_ALPHABET_SIZE}.`,
    );
  }
  if (!Number.isSafeInteger(length) || length < 1 || length > MAX_NANOID_LENGTH) {
    throw new RangeError(`Length must be a whole number between 1 and ${MAX_NANOID_LENGTH}.`);
  }
  if (!Number.isSafeInteger(sampleCount) || sampleCount < 1 || sampleCount > MAX_NANOID_QUANTITY) {
    throw new RangeError(`Sample count must be between 1 and ${MAX_NANOID_QUANTITY}.`);
  }

  const logNamespaceSize = length * Math.log(alphabetSize);
  const entropyBits = length * Math.log2(alphabetSize);
  const onePercentLogCount = 0.5
    * (Math.log(2) + logNamespaceSize + Math.log(-Math.log(0.99)));
  const namespaceCapacity = BigInt(alphabetSize) ** BigInt(length);
  const collisionIsCertain = BigInt(sampleCount) > namespaceCapacity;

  if (sampleCount < 2) {
    return {
      alphabetSize,
      entropyBits,
      namespaceSize: toScientificNumber(logNamespaceSize),
      collisionProbability: 0,
      onePercentCollisionCount: toScientificNumber(onePercentLogCount),
    };
  }

  if (collisionIsCertain) {
    return {
      alphabetSize,
      entropyBits,
      namespaceSize: toScientificNumber(logNamespaceSize),
      collisionProbability: 1,
      collisionProbabilityScientific: { mantissa: 1, exponent: 0 },
      onePercentCollisionCount: toScientificNumber(onePercentLogCount),
    };
  }

  const safeIntegerCapacity = namespaceCapacity <= BigInt(Number.MAX_SAFE_INTEGER)
    ? Number(namespaceCapacity)
    : undefined;
  let collisionProbability: number;
  let logCollisionProbability: number;

  if (safeIntegerCapacity !== undefined) {
    let logNoCollision = 0;
    for (let index = 1; index < sampleCount; index += 1) {
      logNoCollision += Math.log1p(-index / safeIntegerCapacity);
    }
    collisionProbability = -Math.expm1(logNoCollision);
    logCollisionProbability = Math.log(collisionProbability);
  }
  else {
    const logExpectedCollisionPairs = Math.log(sampleCount)
      + Math.log(sampleCount - 1)
      - Math.log(2)
      - logNamespaceSize;
    const expectedCollisionPairs = logExpectedCollisionPairs < Math.log(Number.MIN_VALUE)
      ? 0
      : Math.exp(logExpectedCollisionPairs);
    collisionProbability = expectedCollisionPairs === 0
      ? 0
      : -Math.expm1(-expectedCollisionPairs);
    logCollisionProbability = expectedCollisionPairs === 0 || logExpectedCollisionPairs < -20
      ? logExpectedCollisionPairs
      : Math.log(collisionProbability);
  }

  return {
    alphabetSize,
    entropyBits,
    namespaceSize: toScientificNumber(logNamespaceSize),
    collisionProbability,
    collisionProbabilityScientific: toScientificNumber(logCollisionProbability),
    onePercentCollisionCount: toScientificNumber(onePercentLogCount),
  };
}

export function formatScientificNumber({ mantissa, exponent }: ScientificNumber) {
  if (exponent >= -2 && exponent <= 5) {
    return (mantissa * 10 ** exponent).toLocaleString('en-US', { maximumSignificantDigits: 3 });
  }

  return `${mantissa.toFixed(2)} × 10^${exponent}`;
}
