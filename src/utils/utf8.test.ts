import { describe, expect, it } from 'vitest';
import { exceedsUtf8ByteLimit } from './utf8';

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
