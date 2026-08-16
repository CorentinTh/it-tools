export const ICALENDAR_MAX_BYTES = 64 * 1024;
export const ICALENDAR_MAX_LINES = 1_000;
export const ICALENDAR_MAX_PROPERTY_CHARACTERS = 32 * 1024;

export interface IsoWeekDate {
  year: number
  week: number
  weekday: number
}

export interface CalendarEventInput {
  uid: string
  summary: string
  description: string
  location: string
  startUtc: string
  endUtc: string
  stampUtc: string
}

const DAY_MS = 86_400_000;

function utcDate(year: number, month: number, day: number): Date {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return date;
}

export function parseIsoDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) {
    throw new TypeError('Use a strict YYYY-MM-DD date.');
  }
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new RangeError('The calendar date is outside the supported 0001–9999 range.');
  }
  const date = utcDate(year, month, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new RangeError('The calendar date does not exist.');
  }
  return date;
}

function formatIsoDate(date: Date): string {
  return `${String(date.getUTCFullYear()).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function dateToIsoWeek(value: string): IsoWeekDate {
  const date = parseIsoDate(value);
  const weekday = date.getUTCDay() || 7;
  const thursday = new Date(date.getTime() + (4 - weekday) * DAY_MS);
  const year = thursday.getUTCFullYear();
  const yearStart = utcDate(year, 1, 1);
  const week = Math.ceil(((thursday.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
  return { year, week, weekday };
}

export function weeksInIsoYear(year: number): number {
  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    throw new RangeError('ISO week year must be an integer from 1 to 9999.');
  }
  return dateToIsoWeek(`${String(year).padStart(4, '0')}-12-28`).week;
}

export function isoWeekToDate(year: number, week: number, weekday: number): string {
  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    throw new RangeError('ISO week year must be an integer from 1 to 9999.');
  }
  if (!Number.isInteger(week) || week < 1 || week > weeksInIsoYear(year)) {
    throw new RangeError(`ISO week must be between 1 and ${weeksInIsoYear(year)} for ${year}.`);
  }
  if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7) {
    throw new RangeError('ISO weekday must be an integer from 1 (Monday) to 7 (Sunday).');
  }
  const january4 = utcDate(year, 1, 4);
  const january4Weekday = january4.getUTCDay() || 7;
  const monday = new Date(january4.getTime() - (january4Weekday - 1) * DAY_MS);
  return formatIsoDate(new Date(monday.getTime() + ((week - 1) * 7 + weekday - 1) * DAY_MS));
}

function parseUtcMinute(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?Z?$/u.exec(value);
  if (!match) {
    throw new TypeError('Use YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss for UTC date-times.');
  }
  const date = parseIsoDate(`${match[1]}-${match[2]}-${match[3]}`);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6] ?? 0);
  if (hour > 23 || minute > 59 || second > 59) {
    throw new RangeError('The UTC time does not exist.');
  }
  date.setUTCHours(hour, minute, second, 0);
  return date;
}

function formatIcalUtc(value: string): string {
  const date = parseUtcMinute(value);
  return `${String(date.getUTCFullYear()).padStart(4, '0')}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}T${String(date.getUTCHours()).padStart(2, '0')}${String(date.getUTCMinutes()).padStart(2, '0')}${String(date.getUTCSeconds()).padStart(2, '0')}Z`;
}

export function escapeIcalendarText(value: string): string {
  return value.replace(/\\/gu, '\\\\').replace(/\r\n|\r|\n/gu, '\\n').replace(/,/gu, '\\,').replace(/;/gu, '\\;');
}

export function unescapeIcalendarText(value: string): string {
  let output = '';
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] !== '\\' || index + 1 >= value.length) {
      output += value[index];
      continue;
    }
    const escaped = value[index + 1];
    output += escaped === 'n' || escaped === 'N' ? '\n' : escaped;
    index += 1;
  }
  return output;
}

export function foldIcalendarLine(line: string): string {
  if (line.length > ICALENDAR_MAX_PROPERTY_CHARACTERS) {
    throw new RangeError('Each iCalendar property is limited to 32 KiB.');
  }
  const parts: string[] = [];
  let current = '';
  let bytes = 0;
  let limit = 75;
  for (const character of line) {
    const characterBytes = new TextEncoder().encode(character).byteLength;
    if (bytes + characterBytes > limit && current) {
      parts.push(current);
      current = character;
      bytes = characterBytes;
      limit = 74;
    }
    else {
      current += character;
      bytes += characterBytes;
    }
  }
  parts.push(current);
  return parts.join('\r\n ');
}

function validateEventField(value: string, label: string, maximum: number, required = false): void {
  if (required && !value.trim()) {
    throw new TypeError(`${label} is required.`);
  }
  if (value.length > maximum || /\0/u.test(value)) {
    throw new RangeError(`${label} is too long or contains a null character.`);
  }
}

export function buildIcalendarEvent(input: CalendarEventInput): string {
  validateEventField(input.uid, 'UID', 256, true);
  validateEventField(input.summary, 'Summary', 512, true);
  validateEventField(input.description, 'Description', 16 * 1024);
  validateEventField(input.location, 'Location', 1024);
  const start = parseUtcMinute(input.startUtc);
  const end = parseUtcMinute(input.endUtc);
  if (end.getTime() <= start.getTime()) {
    throw new RangeError('Event end must be after event start.');
  }
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//IT Tools//Local Event Builder//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${escapeIcalendarText(input.uid.trim())}`,
    `DTSTAMP:${formatIcalUtc(input.stampUtc)}`,
    `DTSTART:${formatIcalUtc(input.startUtc)}`,
    `DTEND:${formatIcalUtc(input.endUtc)}`,
    `SUMMARY:${escapeIcalendarText(input.summary)}`,
    ...(input.location ? [`LOCATION:${escapeIcalendarText(input.location)}`] : []),
    ...(input.description ? [`DESCRIPTION:${escapeIcalendarText(input.description)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(foldIcalendarLine).join('\r\n')}\r\n`;
}

export function unfoldIcalendar(source: string): string[] {
  if (new TextEncoder().encode(source).byteLength > ICALENDAR_MAX_BYTES) {
    throw new RangeError('iCalendar input is limited to 64 KiB.');
  }
  if (/\0/u.test(source)) {
    throw new TypeError('iCalendar input contains a null character.');
  }
  const physical = source.replace(/\r\n/gu, '\n').replace(/\r/gu, '\n').split('\n');
  if (physical.length > ICALENDAR_MAX_LINES) {
    throw new RangeError('iCalendar input is limited to 1,000 physical lines.');
  }
  const logical: string[] = [];
  for (const line of physical) {
    if (/^[ \t]/u.test(line)) {
      if (!logical.length) {
        throw new TypeError('A folded continuation cannot appear before a property.');
      }
      logical[logical.length - 1] += line.slice(1);
    }
    else if (line) {
      logical.push(line);
    }
  }
  if (logical.some(line => line.length > ICALENDAR_MAX_PROPERTY_CHARACTERS)) {
    throw new RangeError('Each unfolded iCalendar property is limited to 32 KiB.');
  }
  return logical;
}

export function inspectIcalendarEvent(source: string): string {
  const lines = unfoldIcalendar(source);
  const begin = lines.indexOf('BEGIN:VEVENT');
  const end = lines.indexOf('END:VEVENT', begin + 1);
  if (begin < 0 || end < 0) {
    throw new TypeError('The input does not contain a complete VEVENT component.');
  }
  const fields = new Map<string, string[]>();
  for (const line of lines.slice(begin + 1, end)) {
    const separator = line.indexOf(':');
    if (separator <= 0) {
      throw new TypeError('An iCalendar property is missing its colon separator.');
    }
    const name = line.slice(0, separator).split(';', 1)[0].toUpperCase();
    const value = line.slice(separator + 1);
    const values = fields.get(name) ?? [];
    values.push(value);
    fields.set(name, values);
  }
  const display = (name: string) => (fields.get(name) ?? []).map(unescapeIcalendarText);
  return [
    `VEVENT properties: ${[...fields.values()].reduce((sum, values) => sum + values.length, 0).toLocaleString('en-US')}`,
    `UID: ${display('UID')[0] ?? '(missing)'}`,
    `Summary: ${display('SUMMARY')[0] ?? '(missing)'}`,
    `Start: ${display('DTSTART')[0] ?? '(missing)'}`,
    `End: ${display('DTEND')[0] ?? '(missing)'}`,
    `Location: ${display('LOCATION')[0] ?? '(missing)'}`,
    `Description: ${display('DESCRIPTION')[0] ?? '(missing)'}`,
    '',
    'Property names:',
    ...[...fields].map(([name, values]) => `${name} × ${values.length}`),
  ].join('\n');
}
