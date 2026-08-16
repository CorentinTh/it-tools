import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  generateUuidV1Batch,
  generateUuidV6Batch,
  generateUuidV7Batch,
  inspectObjectId,
  inspectSnowflake,
  inspectUuid,
  normalizeUuid,
} from './uuid-generator.service';
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
      node: new Uint8Array([0x11, 0x20, 0x30, 0x40, 0x50, 0x60]),
      nsecs: 0,
    });
    expect(uuidV1Factory).toHaveBeenNthCalledWith(3, {
      clockseq: 0x0AFE,
      msecs: 1_700_000_000_000,
      node: new Uint8Array([0x11, 0x20, 0x30, 0x40, 0x50, 0x60]),
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

describe('modern identifiers', () => {
  const zeroRandom: RandomValuesProvider = (values) => {
    values.fill(0);
    return values;
  };

  it('generates RFC-variant UUID v6 and v7 values with recoverable timestamps', () => {
    const now = 1_700_000_000_000;
    const v6 = generateUuidV6Batch({ count: 2, getRandomValues: zeroRandom, now: () => now });
    const v7 = generateUuidV7Batch({ count: 1, getRandomValues: zeroRandom, now: () => now });

    expect(v6[0]).toMatch(/^[0-9a-f-]{14}6[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(new Set(v6).size).toBe(2);
    expect(v7[0]).toMatch(/^[0-9a-f-]{14}7[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(inspectUuid(v6[0]).details).toContainEqual({ label: 'Embedded timestamp', value: new Date(now).toISOString() });
    expect(inspectUuid(v7[0]).details).toContainEqual({ label: 'Embedded timestamp', value: new Date(now).toISOString() });
  });

  it('normalizes common UUID wrappers without changing bits', () => {
    expect(normalizeUuid('{01890ABCDEF070008000000000000001}')).toBe('01890abc-def0-7000-8000-000000000001');
    expect(normalizeUuid('urn:uuid:01890ABC-DEF0-7000-8000-000000000001')).toBe('01890abc-def0-7000-8000-000000000001');
    expect(() => normalizeUuid('not-a-uuid')).toThrow('32 hexadecimal');
  });

  it('inspects Mongo ObjectID timestamps and counters', () => {
    const result = inspectObjectId('507F1F77BCF86CD799439011');
    expect(result.canonical).toBe('507f1f77bcf86cd799439011');
    expect(result.details).toContainEqual({ label: 'Timestamp', value: '2012-10-17T21:13:27.000Z' });
    expect(result.details).toContainEqual({ label: 'Counter', value: '4427793' });
  });

  it('inspects Snowflake timestamp, worker, process, and sequence fields exactly', () => {
    const epoch = 1_420_070_400_000n;
    const timestamp = 1_700_000_000_000n;
    const identifier = ((timestamp - epoch) << 22n) | (17n << 17n) | (3n << 12n) | 42n;
    const result = inspectSnowflake(identifier.toString(), epoch.toString());
    expect(result.details).toEqual([
      { label: 'Timestamp', value: new Date(Number(timestamp)).toISOString() },
      { label: 'Worker ID', value: '17' },
      { label: 'Process ID', value: '3' },
      { label: 'Sequence', value: '42' },
    ]);
  });

  it('rejects a safe integer timestamp outside the ECMAScript Date range', () => {
    expect(() => inspectSnowflake('0', String(Number.MAX_SAFE_INTEGER))).toThrow('outside the JavaScript date range');
  });
});
