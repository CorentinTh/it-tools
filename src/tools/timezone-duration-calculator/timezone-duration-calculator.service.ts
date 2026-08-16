export interface LocalDateTime {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

export interface ZonedInstantResolution {
  instants: number[]
  ambiguous: boolean
}

export interface ZonedDateTimeDisplay {
  local: string
  offset: string
  abbreviation: string
  isoUtc: string
  epochMilliseconds: number
}

export interface DurationResult {
  milliseconds: number
  seconds: number
  sign: -1 | 0 | 1
  days: number
  hours: number
  minutes: number
  remainingSeconds: number
  isoDuration: string
}

const LOCAL_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
const PARTS_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = PARTS_FORMATTERS.get(timeZone);
  if (cached) {
    return cached;
  }
  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      calendar: 'gregory',
      numberingSystem: 'latn',
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  catch {
    throw new Error(`Unsupported time zone: ${timeZone}.`);
  }
  PARTS_FORMATTERS.set(timeZone, formatter);
  return formatter;
}

function partsAt(epochMilliseconds: number, timeZone: string): LocalDateTime {
  const values = Object.fromEntries(partsFormatter(timeZone).formatToParts(epochMilliseconds)
    .filter(part => part.type !== 'literal')
    .map(part => [part.type, Number(part.value)]));
  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
}

function sameLocal(left: LocalDateTime, right: LocalDateTime): boolean {
  return left.year === right.year
    && left.month === right.month
    && left.day === right.day
    && left.hour === right.hour
    && left.minute === right.minute
    && left.second === right.second;
}

export function parseLocalDateTime(value: string): LocalDateTime {
  const match = LOCAL_DATE_TIME_PATTERN.exec(value.trim());
  if (!match) {
    throw new Error('Use local date-time format YYYY-MM-DDTHH:mm:ss.');
  }
  const parsed: LocalDateTime = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6] ?? 0),
  };
  const timestamp = Date.UTC(parsed.year, parsed.month - 1, parsed.day, parsed.hour, parsed.minute, parsed.second);
  const roundTrip = new Date(timestamp);
  if (
    parsed.year < 1
    || roundTrip.getUTCFullYear() !== parsed.year
    || roundTrip.getUTCMonth() !== parsed.month - 1
    || roundTrip.getUTCDate() !== parsed.day
    || roundTrip.getUTCHours() !== parsed.hour
    || roundTrip.getUTCMinutes() !== parsed.minute
    || roundTrip.getUTCSeconds() !== parsed.second
  ) {
    throw new Error('Enter a valid calendar date and time.');
  }
  return parsed;
}

function localAsUtc(value: LocalDateTime): number {
  return Date.UTC(value.year, value.month - 1, value.day, value.hour, value.minute, value.second);
}

function offsetAt(epochMilliseconds: number, timeZone: string): number {
  const local = partsAt(epochMilliseconds, timeZone);
  return localAsUtc(local) - Math.floor(epochMilliseconds / 1000) * 1000;
}

export function resolveZonedDateTime(localSource: string, timeZone: string): ZonedInstantResolution {
  const local = parseLocalDateTime(localSource);
  const naiveEpoch = localAsUtc(local);
  const offsetSamples = new Set([
    offsetAt(naiveEpoch - 86_400_000, timeZone),
    offsetAt(naiveEpoch, timeZone),
    offsetAt(naiveEpoch + 86_400_000, timeZone),
  ]);
  const instants = Array.from(offsetSamples, offset => naiveEpoch - offset)
    .filter(epoch => sameLocal(partsAt(epoch, timeZone), local))
    .sort((left, right) => left - right)
    .filter((epoch, index, values) => index === 0 || epoch !== values[index - 1]);
  if (instants.length === 0) {
    throw new Error(`That local time does not exist in ${timeZone}, usually because clocks move forward.`);
  }
  return { instants, ambiguous: instants.length > 1 };
}

function offsetLabel(offsetMilliseconds: number): string {
  const sign = offsetMilliseconds < 0 ? '-' : '+';
  const absoluteMinutes = Math.abs(offsetMilliseconds) / 60_000;
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatZonedDateTime(epochMilliseconds: number, timeZone: string): ZonedDateTimeDisplay {
  const local = partsAt(epochMilliseconds, timeZone);
  const localText = `${String(local.year).padStart(4, '0')}-${String(local.month).padStart(2, '0')}-${String(local.day).padStart(2, '0')} ${String(local.hour).padStart(2, '0')}:${String(local.minute).padStart(2, '0')}:${String(local.second).padStart(2, '0')}`;
  const abbreviationFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'short',
    hour: '2-digit',
  });
  const abbreviation = abbreviationFormatter.formatToParts(epochMilliseconds)
    .find(part => part.type === 'timeZoneName')?.value ?? timeZone;
  return {
    local: localText,
    offset: offsetLabel(offsetAt(epochMilliseconds, timeZone)),
    abbreviation,
    isoUtc: new Date(epochMilliseconds).toISOString(),
    epochMilliseconds,
  };
}

export function calculateDuration(startEpoch: number, endEpoch: number): DurationResult {
  if (!Number.isFinite(startEpoch) || !Number.isFinite(endEpoch)) {
    throw new TypeError('Duration endpoints must be valid instants.');
  }
  const milliseconds = endEpoch - startEpoch;
  const sign: -1 | 0 | 1 = milliseconds === 0 ? 0 : milliseconds < 0 ? -1 : 1;
  let remainingSecondsTotal = Math.floor(Math.abs(milliseconds) / 1000);
  const days = Math.floor(remainingSecondsTotal / 86_400);
  remainingSecondsTotal %= 86_400;
  const hours = Math.floor(remainingSecondsTotal / 3_600);
  remainingSecondsTotal %= 3_600;
  const minutes = Math.floor(remainingSecondsTotal / 60);
  const remainingSeconds = remainingSecondsTotal % 60;
  const isoDuration = `${sign < 0 ? '-' : ''}P${days}DT${hours}H${minutes}M${remainingSeconds}S`;
  return {
    milliseconds,
    seconds: milliseconds / 1000,
    sign,
    days,
    hours,
    minutes,
    remainingSeconds,
    isoDuration,
  };
}

export function getSupportedTimeZones(): string[] {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: 'timeZone') => string[] };
  const supported = intl.supportedValuesOf?.('timeZone');
  return supported && supported.length > 0
    ? supported
    : ['UTC', 'America/Los_Angeles', 'America/New_York', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/Berlin', 'Europe/London', 'Europe/Moscow'];
}
