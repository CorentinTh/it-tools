import { describe, expect, it } from 'vitest';
import { buildIcalendarEvent, dateToIsoWeek, foldIcalendarLine, inspectIcalendarEvent, isoWeekToDate, unfoldIcalendar } from './date-calendar-utilities.service';

describe('date and calendar utilities', () => {
  it('converts across ISO week-year boundaries exactly', () => {
    expect(dateToIsoWeek('2021-01-01')).toEqual({ year: 2020, week: 53, weekday: 5 });
    expect(isoWeekToDate(2020, 53, 5)).toBe('2021-01-01');
    expect(() => isoWeekToDate(2021, 53, 1)).toThrow(/between 1 and 52/u);
  });

  it('builds escaped, folded, deterministic UTC VEVENT data', () => {
    const output = buildIcalendarEvent({ uid: 'demo@example.local', summary: 'Review, ship; repeat', description: 'Line 1\nПривет '.repeat(8), location: 'Room; 1', startUtc: '2026-08-16T10:00', endUtc: '2026-08-16T11:30', stampUtc: '2026-08-01T00:00' });
    expect(output).toContain('DTSTART:20260816T100000Z');
    expect(output).toContain('SUMMARY:Review\\, ship\\; repeat');
    expect(output).toContain('\r\n ');
    expect(inspectIcalendarEvent(output)).toContain('Summary: Review, ship; repeat');
  });

  it('folds by UTF-8 octets without splitting code points and unfolds exactly', () => {
    const line = `DESCRIPTION:${'😀'.repeat(30)}`;
    const folded = foldIcalendarLine(line);
    expect(folded.split('\r\n').every(part => new TextEncoder().encode(part).byteLength <= 75)).toBe(true);
    expect(unfoldIcalendar(folded)).toEqual([line]);
  });

  it('rejects impossible dates, invalid event order, and malformed folding', () => {
    expect(() => dateToIsoWeek('2025-02-29')).toThrow(/does not exist/u);
    expect(() => buildIcalendarEvent({ uid: 'x', summary: 'x', description: '', location: '', startUtc: '2026-01-01T12:00', endUtc: '2026-01-01T11:00', stampUtc: '2026-01-01T00:00' })).toThrow(/end must be after/u);
    expect(() => unfoldIcalendar(' continuation')).toThrow(/cannot appear/u);
  });
});
