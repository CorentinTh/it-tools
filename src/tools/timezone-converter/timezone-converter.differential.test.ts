import { expect, it } from 'vitest';
import {
  convertBetweenTimezones,
  getTimeZoneOffsetMs,
  listTimezones,
  offsetLabel,
} from './timezone-converter.models';

it('offset matches Intl shortOffset rendering across all zones and dense instants', () => {
  const zones = listTimezones().filter(z => z !== 'UTC');
  const now = Date.now();
  let checked = 0;
  for (const zone of zones) {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' });
    for (let dayOffset = -400; dayOffset <= 400; dayOffset += 7) {
      for (const hour of [0, 3, 6, 9, 12, 15, 18, 21]) {
        const date = new Date(now + dayOffset * 86400_000 + hour * 3600_000);
        const mine = offsetLabel(getTimeZoneOffsetMs(date, zone));
        const intlName = formatter.formatToParts(date).find(p => p.type === 'timeZoneName')!.value;
        // The tool styles zero offsets as 'UTC' while en-US shortOffset
        // renders 'GMT+0'; normalize before comparing.
        const normalized = /GMT\+?0$/.test(intlName) ? 'GMT' : intlName;
        const expected = normalized === 'GMT' ? 'UTC' : `UTC${normalized.slice(3)}`;
        expect(mine, `${zone} @ ${date.toISOString()}`).toBe(expected);
        checked++;
      }
    }
  }
  expect(checked).toBeGreaterThan(300000);
});

it('A to B to A roundtrip is lossless across zone pairs', () => {
  const zones = listTimezones();
  const now = Date.now();
  let roundtrips = 0;
  for (const fromTz of zones) {
    for (const toTz of zones.slice(0, 8)) {
      if (fromTz === toTz) {
        continue;
      }
      const instant = new Date(now + ((roundtrips * 3_600_000 * 7) % (400 * 86400_000)));
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: fromTz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(instant);
      const v = Object.fromEntries(parts.map(p => [p.type, p.value]));
      const naive = `${v.year}-${v.month}-${v.day} ${v.hour}:${v.minute}:${v.second}`;
      const forward = convertBetweenTimezones({ dateTime: naive, fromTz, toTz });
      const back = convertBetweenTimezones({ dateTime: forward.formatted, fromTz: toTz, toTz: fromTz });
      expect(back.formatted, `${fromTz}->${toTz} (forward ${forward.formatted})`).toBe(naive);
      roundtrips++;
    }
  }
  expect(roundtrips).toBeGreaterThan(1000);
});

it('resolves wall times near midnight-adjacent fall-back transitions (Malta regression)', () => {
  // EU fall-back happens at 01:00 UTC, so the offset at the naive time
  // treated as UTC (CET, +1) differs from the offset at the true instant
  // (CEST, +2). The single-pass algorithm parsed this 1 hour late:
  // 2027-10-31 01:05:27 CEST is instant 2027-10-30 23:05:27Z, which in
  // UTC+3 Asmera renders as 2027-10-31 02:05:27.
  const converted = convertBetweenTimezones({ dateTime: '2027-10-31 01:05:27', fromTz: 'Europe/Malta', toTz: 'Africa/Asmera' });
  expect(converted.formatted).toBe('2027-10-31 02:05:27');
  expect(converted.sourceOffset).toBe('UTC+2');
});

it('gap and fold instants resolve to the valid neighborhood', () => {
  const gap = convertBetweenTimezones({ dateTime: '2026-03-08 02:30:00', fromTz: 'America/New_York', toTz: 'UTC' });
  expect(gap.formatted).toMatch(/^2026-03-08 0[6-7]:30:00$/);
  const fold = convertBetweenTimezones({ dateTime: '2026-11-01 01:30:00', fromTz: 'America/New_York', toTz: 'UTC' });
  expect(fold.formatted).toMatch(/^2026-11-01 0[5-6]:30:00$/);
});
