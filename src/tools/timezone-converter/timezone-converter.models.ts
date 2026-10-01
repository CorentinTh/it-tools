export interface TimezoneConversion {
  /** The instant, formatted in the target timezone. */
  formatted: string
  /** e.g. 'UTC+8' or 'UTC-4:30'. */
  targetOffset: string
  sourceOffset: string
}

/** Offset of a timezone at a given instant, in milliseconds. */
function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
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

function offsetLabel(offsetMs: number): string {
  if (offsetMs === 0) {
    return 'UTC';
  }
  const sign = offsetMs < 0 ? '-' : '+';
  const total = Math.abs(offsetMs) / 60000;
  const hours = Math.floor(total / 60);
  const minutes = Math.round(total % 60);
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

  const sourceOffset = getTimeZoneOffsetMs(new Date(assumedUtc), fromTz);
  const trueUtc = assumedUtc - sourceOffset;
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
