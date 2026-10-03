export interface TimezoneConversion {
  /** The instant, formatted in the target timezone. */
  formatted: string
  /** e.g. 'UTC+8' or 'UTC-4:30'. */
  targetOffset: string
  sourceOffset: string
}

/** Offset of a timezone at a given instant, in milliseconds. Exported for
 *  the differential suite — mirroring it there trips SonarCloud's copy-paste
 *  detection and would leave the sweep testing a copy, not the real code. */
export function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour) % 24,
    Number(values.minute),
    Number(values.second),
  );
  return asUtc - date.getTime();
}

export function offsetLabel(offsetMs: number): string {
  // getTimeZoneOffsetMs carries sub-second residue from Date milliseconds;
  // round to whole minutes BEFORE the sign test or a -363 ms residue on a
  // zero-offset zone renders as 'UTC-0'.
  const totalMinutes = Math.round(offsetMs / 60000);
  if (totalMinutes === 0) {
    return 'UTC';
  }
  const sign = totalMinutes < 0 ? '-' : '+';
  const abs = Math.abs(totalMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  const minutesLabel = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : '';
  return `UTC${sign}${hours}${minutes > 0 ? minutesLabel : ''}`;
}

/** Interpret a naive local datetime ('YYYY-MM-DD HH:mm:ss') in `fromTz` and
 *  render it in `toTz`, honoring each zone's DST rules. */
export function convertBetweenTimezones({ dateTime, fromTz, toTz }: { dateTime: string; fromTz: string; toTz: string }): TimezoneConversion {
  const normalized = dateTime.trim().replace(' ', 'T');
  const assumedUtc = Date.parse(`${normalized}Z`);
  if (Number.isNaN(assumedUtc)) {
    throw new TypeError('Invalid date/time (expected YYYY-MM-DD HH:mm:ss)');
  }

  const invalidZone = (name: string) => {
    try {
      // constructing validates the zone identifier
      return !Intl.DateTimeFormat('en-US', { timeZone: name }).resolvedOptions().timeZone;
    }
    catch {
      return true;
    }
  };
  if (invalidZone(fromTz)) {
    throw new Error(`Unknown source timezone: ${fromTz}`);
  }
  if (invalidZone(toTz)) {
    throw new Error(`Unknown target timezone: ${toTz}`);
  }

  // Resolve the source-zone offset by fixed-point iteration. A single pass
  // measures the offset at the naive time treated as UTC, which is wrong
  // whenever the true instant sits across a nearby transition (e.g. EU
  // fall-back at 01:00 UTC makes wall 01:05 CEST correspond to the previous
  // day). Iterate until the offset is self-consistent; realizable wall
  // times converge in ≤ 2 steps, and gap/fold times settle on one of the
  // adjacent offsets.
  let sourceOffset = getTimeZoneOffsetMs(new Date(assumedUtc), fromTz);
  let trueUtc = assumedUtc - sourceOffset;
  for (let i = 0; i < 3; i++) {
    const nextOffset = getTimeZoneOffsetMs(new Date(trueUtc), fromTz);
    if (nextOffset === sourceOffset) {
      break;
    }
    sourceOffset = nextOffset;
    trueUtc = assumedUtc - sourceOffset;
  }
  const targetOffset = getTimeZoneOffsetMs(new Date(trueUtc), toTz);

  const target = new Date(trueUtc + targetOffset);
  const formatted = target.toISOString().replace('T', ' ').slice(0, 19);

  return {
    formatted,
    targetOffset: offsetLabel(targetOffset),
    sourceOffset: offsetLabel(sourceOffset),
  };
}

/** Full IANA list on modern runtimes; a small fallback elsewhere. */
export function listTimezones(): string[] {
  const intl = Intl as unknown as { supportedValuesOf?: (key: string) => string[] };
  if (typeof intl.supportedValuesOf === 'function') {
    const zones = intl.supportedValuesOf('timeZone');
    return zones.includes('UTC') ? zones : ['UTC', ...zones];
  }
  return ['UTC', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'Asia/Shanghai', 'Asia/Tokyo', 'Australia/Sydney'];
}
