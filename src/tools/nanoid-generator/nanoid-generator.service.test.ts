import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_NANOID_ALPHABET,
  MAX_NANOID_LENGTH,
  MAX_NANOID_OUTPUT_BYTES,
  MAX_NANOID_QUANTITY,
  MAX_NANOID_TOTAL_SYMBOLS,
  calculateNanoIdCollisionMetrics,
  formatScientificNumber,
  generateNanoIdBatch,
  parseNanoIdCountInput,
  validateNanoIdOptions,
} from './nanoid-generator.service';
import type { RandomValuesProvider } from '@/utils/secure-random';

function sequenceRandomValues(sequence: number[]): RandomValuesProvider {
  let offset = 0;

  return (values) => {
    for (let index = 0; index < values.length; index++) {
      values[index] = sequence[offset % sequence.length];
      offset++;
    }

    return values;
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('NanoID generation', () => {
  it('maps every default alphabet symbol without a dependency or modulo bias', () => {
    const alphabetSize = Array.from(DEFAULT_NANOID_ALPHABET).length;
    const batch = generateNanoIdBatch({
      alphabet: DEFAULT_NANOID_ALPHABET,
      length: alphabetSize,
      quantity: 1,
      getRandomValues: sequenceRandomValues(Array.from({ length: alphabetSize }, (_, index) => index)),
    });

    expect(batch.ids).toEqual([DEFAULT_NANOID_ALPHABET]);
    expect(batch.text).toBe(DEFAULT_NANOID_ALPHABET);
  });

  it('rejects the biased uint32 tail and shares one entropy reservoir across IDs', () => {
    const getRandomValues = vi.fn(sequenceRandomValues([0xFFFF_FFFF, 0, 1, 2]));

    const batch = generateNanoIdBatch({
      alphabet: 'ABC',
      length: 1,
      quantity: 3,
      getRandomValues,
    });

    expect(batch).toMatchObject({ ids: ['A', 'B', 'C'], text: 'A\nB\nC' });
    expect(getRandomValues).toHaveBeenCalledTimes(2);
  });

  it('uses Unicode code points as complete symbols', () => {
    const batch = generateNanoIdBatch({
      alphabet: '🚀🌙',
      length: 3,
      quantity: 2,
      getRandomValues: sequenceRandomValues([0, 1]),
    });

    expect(batch.ids).toEqual(['🚀🌙🚀', '🌙🚀🌙']);
    expect(batch.ids.every(id => Array.from(id).length === 3)).toBe(true);
    expect(batch.outputBytes).toBe(new TextEncoder().encode(batch.text).byteLength);
  });

  it.each([
    { alphabet: '01', length: 1, quantity: 1 },
    { alphabet: 'ABC', length: 17, quantity: 19 },
    { alphabet: DEFAULT_NANOID_ALPHABET, length: 21, quantity: 100 },
    { alphabet: Array.from({ length: 256 }, (_, index) => String.fromCodePoint(0x100 + index)).join(''), length: 10, quantity: 10 },
  ])('preserves quantity, length, and alphabet membership for %#', (options) => {
    const batch = generateNanoIdBatch(options);
    const allowedSymbols = new Set(Array.from(options.alphabet));

    expect(batch.ids).toHaveLength(options.quantity);
    expect(batch.text.endsWith('\n')).toBe(false);
    for (const id of batch.ids) {
      expect(Array.from(id)).toHaveLength(options.length);
      expect(Array.from(id).every(symbol => allowedSymbols.has(symbol))).toBe(true);
    }
  });

  it('never calls Math.random', () => {
    const mathRandom = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('Math.random must not be used for NanoIDs');
    });

    const batch = generateNanoIdBatch({ alphabet: 'AB', length: 21, quantity: 4 });

    expect(batch.ids).toHaveLength(4);
    expect(mathRandom).not.toHaveBeenCalled();
  });

  it('accepts the combined symbol boundary and keeps UTF-8 output bounded', () => {
    const batch = generateNanoIdBatch({
      alphabet: '🚀🌙',
      length: 100,
      quantity: MAX_NANOID_TOTAL_SYMBOLS / 100,
      getRandomValues: sequenceRandomValues([0, 1]),
    });

    expect(batch.ids).toHaveLength(1_000);
    expect(batch.outputBytes).toBeLessThanOrEqual(MAX_NANOID_OUTPUT_BYTES);
  });
});

describe('NanoID option validation', () => {
  it('parses only short decimal count inputs before numeric conversion', () => {
    expect(parseNanoIdCountInput('512', MAX_NANOID_LENGTH)).toBe(512);
    expect(parseNanoIdCountInput('001', MAX_NANOID_LENGTH)).toBe(1);
    expect(parseNanoIdCountInput('', MAX_NANOID_LENGTH)).toBeNaN();
    expect(parseNanoIdCountInput('-1', MAX_NANOID_LENGTH)).toBeNaN();
    expect(parseNanoIdCountInput('1.5', MAX_NANOID_LENGTH)).toBeNaN();
    expect(parseNanoIdCountInput('9'.repeat(1_000_000), MAX_NANOID_LENGTH)).toBeNaN();
  });

  it.each([-1, 0, 1.5, Number.NaN, Number.POSITIVE_INFINITY, MAX_NANOID_LENGTH + 1])(
    'rejects invalid length %s',
    (length) => {
      expect(validateNanoIdOptions({ alphabet: 'AB', length, quantity: 1 })).toMatchObject({ isValid: false });
      expect(() => generateNanoIdBatch({ alphabet: 'AB', length, quantity: 1 })).toThrow(RangeError);
    },
  );

  it.each([-1, 0, 1.5, Number.NaN, Number.POSITIVE_INFINITY, MAX_NANOID_QUANTITY + 1])(
    'rejects invalid quantity %s',
    (quantity) => {
      expect(validateNanoIdOptions({ alphabet: 'AB', length: 1, quantity })).toMatchObject({ isValid: false });
    },
  );

  it.each([
    ['', 'between 2 and 256'],
    ['A', 'between 2 and 256'],
    ['AABC', 'unique'],
    ['🚀🚀', 'unique'],
    ['A\nB', 'control or line-separator'],
    ['A\u0000B', 'control or line-separator'],
    ['e\u0301x', 'NFC-normalized'],
    ['\uD800x', 'unpaired Unicode surrogate'],
  ])('rejects invalid alphabet %j', (alphabet, message) => {
    expect(validateNanoIdOptions({ alphabet, length: 21, quantity: 1 }))
      .toMatchObject({ isValid: false, message: expect.stringContaining(message) });
  });

  it('rejects alphabets above 256 code points', () => {
    const alphabet = Array.from({ length: 257 }, (_, index) => String.fromCodePoint(0x400 + index)).join('');

    expect(validateNanoIdOptions({ alphabet, length: 21, quantity: 1 }))
      .toMatchObject({ isValid: false, alphabetSize: 257 });
  });

  it('rejects a huge alphabet before Unicode normalization', () => {
    const normalize = vi.spyOn(String.prototype, 'normalize');

    expect(validateNanoIdOptions({ alphabet: 'A'.repeat(1_000_000), length: 21, quantity: 1 }))
      .toMatchObject({ isValid: false, alphabetSize: 257 });
    expect(normalize).not.toHaveBeenCalled();
  });

  it('rejects a product above the total-symbol limit before requesting entropy', () => {
    const getRandomValues = vi.fn(sequenceRandomValues([0]));
    const options = { alphabet: 'AB', length: MAX_NANOID_LENGTH, quantity: 196 };

    expect(options.length * options.quantity).toBeGreaterThan(MAX_NANOID_TOTAL_SYMBOLS);
    expect(validateNanoIdOptions(options)).toMatchObject({
      isValid: false,
      message: expect.stringContaining('100,000'),
    });
    expect(() => generateNanoIdBatch({ ...options, getRandomValues })).toThrow(RangeError);
    expect(getRandomValues).not.toHaveBeenCalled();
  });
});

describe('NanoID collision guidance', () => {
  it.each([1, 257, 2.5, Number.NaN])('rejects invalid alphabet size %s', (alphabetSize) => {
    expect(() => calculateNanoIdCollisionMetrics({ alphabetSize, length: 21, sampleCount: 1 }))
      .toThrow(RangeError);
  });

  it('reports 126 bits for the default 64-symbol, 21-character space', () => {
    const metrics = calculateNanoIdCollisionMetrics({ alphabetSize: 64, length: 21, sampleCount: 1 });

    expect(metrics.entropyBits).toBe(126);
    expect(metrics.namespaceSize.mantissa).toBeCloseTo(8.507, 2);
    expect(metrics.namespaceSize.exponent).toBe(37);
    expect(metrics.collisionProbability).toBe(0);
    expect(metrics.onePercentCollisionCount.mantissa).toBeCloseTo(1.31, 1);
    expect(metrics.onePercentCollisionCount.exponent).toBe(18);
  });

  it('computes birthday risk in log space for tiny and extreme namespaces', () => {
    const tiny = calculateNanoIdCollisionMetrics({ alphabetSize: 2, length: 1, sampleCount: 2 });
    const extreme = calculateNanoIdCollisionMetrics({ alphabetSize: 256, length: 512, sampleCount: 10_000 });

    expect(tiny.collisionProbability).toBe(0.5);
    expect(tiny.onePercentCollisionCount.mantissa).toBeCloseTo(2.01, 1);
    expect(tiny.onePercentCollisionCount.exponent).toBe(-1);
    expect(extreme.entropyBits).toBe(4096);
    expect(extreme.collisionProbability).toBe(0);
    expect(extreme.collisionProbabilityScientific?.exponent).toBeLessThan(-1_200);
    expect(Number.isFinite(extreme.onePercentCollisionCount.mantissa)).toBe(true);
    expect(extreme.onePercentCollisionCount.exponent).toBeGreaterThan(600);
  });

  it('reports a guaranteed collision when the batch exceeds the identifier namespace', () => {
    const metrics = calculateNanoIdCollisionMetrics({ alphabetSize: 2, length: 1, sampleCount: 3 });

    expect(metrics.namespaceSize).toMatchObject({ mantissa: 2, exponent: 0 });
    expect(metrics.collisionProbability).toBe(1);
    const probability = metrics.collisionProbabilityScientific;
    expect(probability).toEqual({ mantissa: 1, exponent: 0 });
    if (probability === undefined) {
      throw new Error('Expected a scientific collision probability.');
    }
    expect(formatScientificNumber(probability)).toBe('1');
  });

  it('uses the exact collision probability for a representable namespace', () => {
    const metrics = calculateNanoIdCollisionMetrics({ alphabetSize: 10, length: 2, sampleCount: 2 });

    expect(metrics.collisionProbability).toBeCloseTo(0.01, 12);
  });

  it('increases collision risk with batch size and formats scientific values', () => {
    const first = calculateNanoIdCollisionMetrics({ alphabetSize: 3, length: 8, sampleCount: 2 });
    const second = calculateNanoIdCollisionMetrics({ alphabetSize: 3, length: 8, sampleCount: 100 });

    expect(second.collisionProbability).toBeGreaterThan(first.collisionProbability);
    expect(formatScientificNumber({ mantissa: 8.507, exponent: 37 })).toBe('8.51 × 10^37');
    expect(formatScientificNumber({ mantissa: 2, exponent: 0 })).toBe('2');
  });
});
