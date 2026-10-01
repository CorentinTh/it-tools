import { describe, expect, it } from 'vitest';
import { decodeSnowflake } from './snowflake-id-decoder.models';

describe('snowflake-id-decoder', () => {
  it('decodes a Twitter snowflake against the Twitter epoch', () => {
    // 565419792856637440 was posted on 2015-02-09
    const decoded = decodeSnowflake('565419792856637440', 1288834974657);
    expect(decoded.timestamp).toBe(1423641558265);
    expect(decoded.isoDate).toContain('2015-02-11');
  });

  it('decodes a Discord id against the Discord epoch', () => {
    // Discord docs example: id 175928847299117063 -> 2016-04-30T11:18:25.796Z
    const decoded = decodeSnowflake('175928847299117063', 1420070400000);
    expect(decoded.timestamp).toBe(1462015105796);
    expect(decoded.isoDate).toBe('2016-04-30 11:18:25 UTC');
    expect(decoded.datacenterId).toBe(1);
    expect(decoded.workerId).toBe(0);
    expect(decoded.sequence).toBe(7);
  });

  it('rejects non-numeric input', () => {
    expect(() => decodeSnowflake('abc', 0)).toThrow('positive integer');
    expect(() => decodeSnowflake('12 34', 0)).toThrow('positive integer');
    expect(() => decodeSnowflake('-5', 0)).toThrow('positive integer');
  });

  it('handles very large ids beyond Number safe range', () => {
    // 2^63-1 must not lose precision
    const decoded = decodeSnowflake('9223372036854775807', 0);
    expect(decoded.timestamp).toBe(Number(9223372036854775807n >> 22n));
  });

  it('extracts sequence bits', () => {
    // 0b1 << 22 | sequence 0b101010101010
    const id = ((1n << 22n) | 0b101010101010n).toString();
    const decoded = decodeSnowflake(id, 0);
    expect(decoded.sequence).toBe(0b101010101010);
  });
});
