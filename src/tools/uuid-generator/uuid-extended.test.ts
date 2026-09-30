import { describe, expect, it } from 'vitest';
import { generateUuidV6, generateUuidV7 } from './uuid-extended';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('uuid-extended: v6', () => {
  it('produces a valid v6 UUID with correct version and variant nibbles', () => {
    const uuid = generateUuidV6(1700000000000);
    expect(uuid).toMatch(UUID_RE);
    expect(uuid[14]).toBe('6');
    expect(Number.parseInt(uuid[19], 16) & 0b1100).toBe(0b1000);
  });

  it('encodes the given timestamp: v6 time_high starts with the unix-ms top bits', () => {
    // 1700000000000 ms = 0x18BCFE_56C00 (ms). Gregorian 100ns ticks >> 28 must
    // surface in the first 8 hex digits.
    const uuid = generateUuidV6(1700000000000);
    const hex = uuid.replace(/-/g, '');
    const timeHigh = BigInt(`0x${hex.slice(0, 8)}`);
    const timeMid = BigInt(`0x${hex.slice(8, 12)}`);
    const timeLow = BigInt(`0x${hex.slice(13, 16)}`);
    const ticks = (timeHigh << 28n) | (timeMid << 12n) | timeLow;
    const unixMs = Number((ticks - 122192928000000000n) / 10000n);
    expect(Math.abs(unixMs - 1700000000000)).toBeLessThan(2);
  });

  it('is monotonic: later timestamps sort lexicographically after earlier ones', () => {
    const earlier = generateUuidV6(1700000000000);
    const later = generateUuidV6(1700000000001);
    expect(later > earlier).toBe(true);
  });

  it('produces unique values within the same millisecond', () => {
    const uuids = new Set(Array.from({ length: 50 }, () => generateUuidV6(1700000000000)));
    expect(uuids.size).toBe(50);
  });
});

describe('uuid-extended: v7', () => {
  it('produces a valid v7 UUID with correct version and variant nibbles', () => {
    const uuid = generateUuidV7(1700000000000);
    expect(uuid).toMatch(UUID_RE);
    expect(uuid[14]).toBe('7');
    expect(Number.parseInt(uuid[19], 16) & 0b1100).toBe(0b1000);
  });

  it('encodes the unix millisecond timestamp in the first 12 hex digits', () => {
    const uuid = generateUuidV7(1700000000000);
    const hex = uuid.replace(/-/g, '');
    expect(BigInt(`0x${hex.slice(0, 12)}`)).toBe(1700000000000n);
  });

  it('sorts lexicographically across milliseconds', () => {
    const earlier = generateUuidV7(1700000000000);
    const later = generateUuidV7(1700000001000);
    expect(later > earlier).toBe(true);
  });

  it('produces unique values within the same millisecond', () => {
    const uuids = new Set(Array.from({ length: 50 }, () => generateUuidV7(1700000000000)));
    expect(uuids.size).toBe(50);
  });
});
