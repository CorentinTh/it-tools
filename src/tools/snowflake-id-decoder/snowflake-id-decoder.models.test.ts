import { describe, expect, it } from 'vitest';
import { SNOWFLAKE_PLATFORMS, decodeSnowflake } from './snowflake-id-decoder.models';

function platform(key: string) {
  const found = SNOWFLAKE_PLATFORMS.find(p => p.key === key);
  if (!found) {
    throw new Error(`unknown platform ${key}`);
  }
  return found;
}

describe('snowflake-id-decoder', () => {
  it('decodes a Twitter snowflake against the Twitter epoch', () => {
    // 565419792856637440 was posted on 2015-02-09
    const decoded = decodeSnowflake('565419792856637440', platform('twitter'), platform('twitter').epoch);
    expect(decoded.timestamp).toBe(1423641558265);
    expect(decoded.isoDate).toContain('2015-02-11');
  });

  it('decodes the Discord documented example with worker/process naming', () => {
    // https://discord.com/developers/docs/reference#snowflakes-example-snowflake-decomposition
    // 175928847299117063 -> 2016-04-30T11:18:25.796Z, worker 1, process 0, sequence 7
    const decoded = decodeSnowflake('175928847299117063', platform('discord'), platform('discord').epoch);
    expect(decoded.timestamp).toBe(1462015105796);
    expect(decoded.isoDate).toBe('2016-04-30 11:18:25 UTC');
    expect(decoded.fields.find(f => f.label === 'Worker id')?.value).toBe(1);
    expect(decoded.fields.find(f => f.label === 'Process id')?.value).toBe(0);
    expect(decoded.sequence).toBe(7);
  });

  it('decodes Instagram shard/sequence with the 41/13/10 layout', () => {
    const instagram = platform('instagram');
    const id = ((185779978279n << 23n) | (5n << 10n) | 100n).toString();
    const decoded = decodeSnowflake(id, instagram, instagram.epoch);
    expect(decoded.timestamp).toBe(1500000000000);
    expect(decoded.fields.find(f => f.label === 'Shard id')?.value).toBe(5);
    expect(decoded.sequence).toBe(100);
  });

  it('decodes Mastodon ids with the 48/16 layout', () => {
    const id = ((1700000000000n << 16n) | 1234n).toString();
    const decoded = decodeSnowflake(id, platform('mastodon'), 0);
    expect(decoded.timestamp).toBe(1700000000000);
    expect(decoded.sequence).toBe(1234);
    expect(decoded.fields).toHaveLength(0);
  });

  it('rejects non-numeric input', () => {
    const twitter = platform('twitter');
    expect(() => decodeSnowflake('abc', twitter, twitter.epoch)).toThrow('positive integer');
    expect(() => decodeSnowflake('12 34', twitter, twitter.epoch)).toThrow('positive integer');
    expect(() => decodeSnowflake('-5', twitter, twitter.epoch)).toThrow('positive integer');
  });

  it('handles very large ids beyond Number safe range', () => {
    // 2^63-1 must not lose precision
    const decoded = decodeSnowflake('9223372036854775807', platform('twitter'), 0);
    expect(decoded.timestamp).toBe(Number(9223372036854775807n >> 22n));
  });

  it('extracts sequence bits', () => {
    // 0b1 << 22 | sequence 0b101010101010
    const id = ((1n << 22n) | 0b101010101010n).toString();
    const decoded = decodeSnowflake(id, platform('twitter'), 0);
    expect(decoded.sequence).toBe(0b101010101010);
  });

  it('custom epoch keeps the standard 64-bit layout', () => {
    const custom = platform('custom');
    const id = ((1000n << 22n) | (3n << 17n) | (2n << 12n) | 7n).toString();
    const decoded = decodeSnowflake(id, custom, 5000);
    expect(decoded.timestamp).toBe(6000);
    expect(decoded.fields.find(f => f.label === 'Datacenter id')?.value).toBe(3);
    expect(decoded.fields.find(f => f.label === 'Worker id')?.value).toBe(2);
    expect(decoded.sequence).toBe(7);
  });
});
