import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateUuidV1Batch } from './uuid-generator.service';
import type { RandomValuesProvider } from '@/utils/secure-random';

function fixedRandomValues(firstWord: number, secondWord: number): RandomValuesProvider {
  return (values) => {
    values[0] = firstWord;
    values[1] = secondWord;
    return values;
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('generateUuidV1Batch', () => {
  it('derives an RFC multicast node and clock sequence from one injected seed', () => {
    const getRandomValues = vi.fn(fixedRandomValues(0x1020_3040, 0x5060_CAFE));
    const uuidV1Factory = vi.fn(options => String(options.nsecs));

    expect(generateUuidV1Batch({
      count: 3,
      getRandomValues,
      now: () => 1_700_000_000_000,
      uuidV1Factory,
    })).toEqual(['0', '1', '2']);

    expect(getRandomValues).toHaveBeenCalledTimes(1);
    expect(getRandomValues.mock.calls[0][0]).toBeInstanceOf(Uint32Array);
    expect(getRandomValues.mock.calls[0][0]).toHaveLength(2);
    expect(uuidV1Factory).toHaveBeenNthCalledWith(1, {
      clockseq: 0x0AFE,
      msecs: 1_700_000_000_000,
      node: [0x11, 0x20, 0x30, 0x40, 0x50, 0x60],
      nsecs: 0,
    });
    expect(uuidV1Factory).toHaveBeenNthCalledWith(3, {
      clockseq: 0x0AFE,
      msecs: 1_700_000_000_000,
      node: [0x11, 0x20, 0x30, 0x40, 0x50, 0x60],
      nsecs: 2,
    });
  });

  it('uses Web Crypto without touching Math.random and produces unique v1 identifiers', () => {
    const getRandomValues = vi.fn(fixedRandomValues(0xAABB_CCDD, 0xEEFF_1234));
    vi.stubGlobal('crypto', { getRandomValues });
    const mathRandom = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('Math.random must not be used for UUID identifiers');
    });

    const identifiers = generateUuidV1Batch({
      count: 50,
      now: () => 1_700_000_000_000,
    });

    expect(mathRandom).not.toHaveBeenCalled();
    expect(getRandomValues).toHaveBeenCalledTimes(1);
    expect(new Set(identifiers).size).toBe(50);
    for (const identifier of identifiers) {
      expect(identifier).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    }
  });

  it('does not request entropy for an empty batch', () => {
    const getRandomValues = vi.fn(fixedRandomValues(0, 0));
    const uuidV1Factory = vi.fn(() => 'unused');

    expect(generateUuidV1Batch({ count: 0, getRandomValues, uuidV1Factory })).toEqual([]);
    expect(getRandomValues).not.toHaveBeenCalled();
    expect(uuidV1Factory).not.toHaveBeenCalled();
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 10_001])(
    'rejects invalid count %s',
    (count) => {
      expect(() => generateUuidV1Batch({ count })).toThrow(RangeError);
    },
  );
});
