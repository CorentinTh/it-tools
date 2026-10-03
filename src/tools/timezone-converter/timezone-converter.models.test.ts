import { describe, expect, it } from 'vitest';
import { convertBetweenTimezones, listTimezones } from './timezone-converter.models';

describe('timezone-converter', () => {
  const convert = (dateTime: string, fromTz: string, toTz: string) =>
    convertBetweenTimezones({ dateTime, fromTz, toTz });

  it('converts UTC to a fixed-offset zone', () => {
    const result = convert('2024-01-15 12:00:00', 'UTC', 'Asia/Shanghai');
    expect(result.formatted).toBe('2024-01-15 20:00:00');
    expect(result.targetOffset).toBe('UTC+8');
    expect(result.sourceOffset).toBe('UTC');
  });

  it('honors US DST in summer (EDT = UTC-4)', () => {
    const result = convert('2024-07-01 12:00:00', 'America/New_York', 'UTC');
    expect(result.formatted).toBe('2024-07-01 16:00:00');
    expect(result.sourceOffset).toBe('UTC-4');
  });

  it('honors US standard time in winter (EST = UTC-5)', () => {
    const result = convert('2024-01-01 12:00:00', 'America/New_York', 'UTC');
    expect(result.formatted).toBe('2024-01-01 17:00:00');
    expect(result.sourceOffset).toBe('UTC-5');
  });

  it('handles half-hour offset zones', () => {
    const result = convert('2024-03-10 09:30:00', 'UTC', 'Asia/Kolkata');
    expect(result.targetOffset).toBe('UTC+5:30');
    expect(result.formatted).toBe('2024-03-10 15:00:00');
  });

  it('rejects bad datetimes and unknown zones', () => {
    expect(() => convertBetweenTimezones({ dateTime: 'nope', fromTz: 'UTC', toTz: 'UTC' })).toThrow('Invalid date/time');
    expect(() => convertBetweenTimezones({ dateTime: '2024-01-01 10:00:00', fromTz: 'Nowhere/Bad', toTz: 'UTC' })).toThrow('Unknown source timezone');
    expect(() => convertBetweenTimezones({ dateTime: '2024-01-01 10:00:00', fromTz: 'UTC', toTz: 'Nowhere/Bad' })).toThrow('Unknown target timezone');
  });

  it('lists the IANA timezones on modern runtimes', () => {
    const zones = listTimezones();
    expect(zones).toContain('UTC');
    expect(zones).toContain('Asia/Shanghai');
  });
});
