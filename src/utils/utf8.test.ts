import { describe, expect, it } from 'vitest';
import { exceedsUtf8ByteLimit, truncateUtf8ToByteLimit } from './utf8';

describe('exceedsUtf8ByteLimit', () => {
  it('keeps an exact ASCII boundary and rejects the next byte', () => {
    expect(exceedsUtf8ByteLimit('a'.repeat(100), 100)).toBe(false);
    expect(exceedsUtf8ByteLimit(`${'a'.repeat(100)}b`, 100)).toBe(true);
  });

  it('counts Unicode exactly like TextEncoder at boundaries', () => {
    for (const value of ['é', '中', '🙂', '\uD800', '\uDC00', 'A🙂中é']) {
      const bytes = new TextEncoder().encode(value).byteLength;

      expect(exceedsUtf8ByteLimit(value, bytes)).toBe(false);
      expect(exceedsUtf8ByteLimit(value, bytes - 1)).toBe(true);
    }
  });

  it.each([-1, 1.5, Number.MAX_VALUE, Number.NaN])('rejects an invalid byte limit: %s', (limit) => {
    expect(() => exceedsUtf8ByteLimit('value', limit)).toThrow(RangeError);
  });
});

describe('truncateUtf8ToByteLimit', () => {
  it.each([
    ['abcdef', 3, 'abc'],
    ['A🙂B', 5, 'A🙂'],
    ['A🙂B', 4, 'A'],
    ['é中🙂', 5, 'é中'],
    ['\uD800x', 3, '\uD800'],
    ['\uDC00x', 3, '\uDC00'],
  ])('keeps a complete UTF-8 prefix for %j at %d bytes', (value, limit, expected) => {
    const prefix = truncateUtf8ToByteLimit(value, limit);

    expect(prefix).toBe(expected);
    expect(new TextEncoder().encode(prefix).byteLength).toBeLessThanOrEqual(limit);
  });

  it.each([-1, 1.5, Number.MAX_VALUE, Number.NaN])('rejects an invalid byte limit: %s', (limit) => {
    expect(() => truncateUtf8ToByteLimit('value', limit)).toThrow(RangeError);
  });
});
