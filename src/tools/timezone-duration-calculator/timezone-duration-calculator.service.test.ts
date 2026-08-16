import { describe, expect, it } from 'vitest';
import {
  calculateDuration,
  formatZonedDateTime,
  parseLocalDateTime,
  resolveZonedDateTime,
} from './timezone-duration-calculator.service';

describe('timezone conversion', () => {
  it('parses strict, valid local calendar timestamps', () => {
    expect(parseLocalDateTime('2024-02-29T23:59:58')).toEqual({
      year: 2024,
      month: 2,
      day: 29,
      hour: 23,
      minute: 59,
      second: 58,
    });
    expect(() => parseLocalDateTime('2023-02-29T12:00:00')).toThrow(/valid calendar/);
    expect(() => parseLocalDateTime('2024-01-01 12:00')).toThrow(/YYYY-MM-DD/);
  });

  it('resolves stable and fractional-offset zones to exact instants', () => {
    const utc = resolveZonedDateTime('2026-01-15T12:00:00', 'UTC');
    expect(utc).toEqual({ instants: [Date.UTC(2026, 0, 15, 12)], ambiguous: false });

    const kathmandu = resolveZonedDateTime('2026-01-15T12:00:00', 'Asia/Katmandu');
    const display = formatZonedDateTime(kathmandu.instants[0], 'Asia/Katmandu');
    expect(display.local).toBe('2026-01-15 12:00:00');
    expect(display.offset).toBe('UTC+05:45');
    expect(display.isoUtc).toBe('2026-01-15T06:15:00.000Z');
  });

  it('rejects the spring DST gap and exposes both fall-back occurrences', () => {
    expect(() => resolveZonedDateTime('2024-03-10T02:30:00', 'America/New_York'))
      .toThrow(/does not exist/);
    const repeated = resolveZonedDateTime('2024-11-03T01:30:00', 'America/New_York');
    expect(repeated.ambiguous).toBe(true);
    expect(repeated.instants).toHaveLength(2);
    expect(repeated.instants[1] - repeated.instants[0]).toBe(3_600_000);
    expect(repeated.instants.map(epoch => formatZonedDateTime(epoch, 'America/New_York').offset))
      .toEqual(['UTC-04:00', 'UTC-05:00']);
  });

  it('rejects unsupported zones without silently using the host timezone', () => {
    expect(() => resolveZonedDateTime('2026-01-01T00:00:00', 'Mars/Olympus_Mons'))
      .toThrow(/Unsupported time zone/);
  });
});

describe('date duration', () => {
  it('calculates signed elapsed time with an ISO-style breakdown', () => {
    expect(calculateDuration(0, 93_784_000)).toEqual({
      milliseconds: 93_784_000,
      seconds: 93_784,
      sign: 1,
      days: 1,
      hours: 2,
      minutes: 3,
      remainingSeconds: 4,
      isoDuration: 'P1DT2H3M4S',
    });
    expect(calculateDuration(3_600_000, 0)).toMatchObject({ sign: -1, isoDuration: '-P0DT1H0M0S' });
    expect(calculateDuration(1, 1)).toMatchObject({ sign: 0, isoDuration: 'P0DT0H0M0S' });
  });

  it('measures elapsed time across a DST jump rather than wall-clock labels', () => {
    const start = resolveZonedDateTime('2024-03-10T01:30:00', 'America/New_York').instants[0];
    const end = resolveZonedDateTime('2024-03-10T03:30:00', 'America/New_York').instants[0];
    expect(calculateDuration(start, end)).toMatchObject({ seconds: 3_600, isoDuration: 'P0DT1H0M0S' });
  });
});
