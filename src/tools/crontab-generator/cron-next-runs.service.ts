import { formatZonedDateTime, resolveZonedDateTime } from '../timezone-duration-calculator/timezone-duration-calculator.service';

export const CRON_DIALECTS = ['unix', 'seconds', 'quartz'] as const;
export type CronDialect = typeof CRON_DIALECTS[number];

export interface CronNextRunsOptions {
  expression: string
  dialect: CronDialect
  timeZone: string
  afterIso: string
  count: number
}

export interface CronRun {
  epochMilliseconds: number
  isoUtc: string
  local: string
  offset: string
  abbreviation: string
}

interface ParsedField {
  values: number[]
  wildcard: boolean
}

interface ParsedCron {
  seconds: ParsedField
  minutes: ParsedField
  hours: ParsedField
  dayOfMonth: ParsedField
  month: ParsedField
  dayOfWeek: ParsedField
  years: ParsedField
  dialect: CronDialect
}

const MONTH_NAMES: Readonly<Record<string, number>> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};
const DAY_NAMES: Readonly<Record<string, number>> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};
const ALIASES: Readonly<Record<string, string>> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};
const MAX_SEARCH_DAYS = 5 * 366;

function integerToken(token: string, names: Readonly<Record<string, number>>, minimum: number, maximum: number, dayOfWeek: boolean): number {
  const normalized = token.toLowerCase();
  const value = names[normalized] ?? (/^\d+$/.test(normalized) ? Number(normalized) : Number.NaN);
  const normalizedValue = dayOfWeek && value === 7 ? 0 : value;
  if (!Number.isSafeInteger(normalizedValue) || normalizedValue < minimum || normalizedValue > maximum) {
    throw new Error(`Cron value "${token}" must be between ${minimum} and ${maximum}.`);
  }
  return normalizedValue;
}

function parseField(
  source: string,
  minimum: number,
  maximum: number,
  names: Readonly<Record<string, number>> = {},
  allowQuestion = false,
  dayOfWeek = false,
): ParsedField {
  const normalized = allowQuestion && source === '?' ? '*' : source;
  if (/[LW#]/i.test(normalized)) {
    throw new Error('L, W, and # cron modifiers are not supported by the next-run calculator.');
  }
  const values = new Set<number>();
  for (const listPart of normalized.split(',')) {
    if (listPart === '') {
      throw new Error('Cron lists must not contain empty values.');
    }
    const [rangeSource, stepSource, ...extra] = listPart.split('/');
    if (extra.length > 0) {
      throw new Error('Cron fields may contain only one step separator.');
    }
    const step = stepSource === undefined ? 1 : Number(stepSource);
    if (!Number.isSafeInteger(step) || step < 1 || step > maximum - minimum + 1) {
      throw new Error('Cron step must be a positive whole number within the field range.');
    }
    let start: number;
    let end: number;
    if (rangeSource === '*') {
      start = minimum;
      end = maximum;
    }
    else {
      const range = rangeSource.split('-');
      if (range.length === 1) {
        start = integerToken(range[0], names, minimum, maximum, dayOfWeek);
        end = stepSource === undefined ? start : maximum;
      }
      else if (range.length === 2) {
        start = integerToken(range[0], names, minimum, maximum, dayOfWeek);
        end = integerToken(range[1], names, minimum, maximum, dayOfWeek);
        if (end < start) {
          throw new Error('Cron ranges must be ascending.');
        }
      }
      else {
        throw new Error('Cron ranges may contain only one dash.');
      }
    }
    for (let value = start; value <= end; value += step) {
      values.add(dayOfWeek && value === 7 ? 0 : value);
    }
  }
  return { values: [...values].sort((left, right) => left - right), wildcard: normalized === '*' };
}

export function parseCronExpression(expression: string, dialect: CronDialect): ParsedCron {
  if (!CRON_DIALECTS.includes(dialect)) {
    throw new Error('Select a supported cron dialect.');
  }
  const trimmed = expression.trim();
  const expanded = ALIASES[trimmed.toLowerCase()];
  if (trimmed.startsWith('@') && !expanded) {
    throw new Error('@reboot and unknown cron aliases do not have calculable future runs.');
  }
  let fields = (expanded ?? trimmed).split(/\s+/);
  if (dialect === 'unix') {
    if (fields.length !== 5) {
      throw new Error('Unix cron requires five fields: minute hour day month weekday.');
    }
    fields = ['0', ...fields];
  }
  else if (dialect === 'seconds' && fields.length !== 6) {
    throw new Error('Cron with seconds requires six fields, starting with seconds.');
  }
  else if (dialect === 'quartz' && fields.length !== 6 && fields.length !== 7) {
    throw new Error('Quartz cron requires six or seven fields, starting with seconds.');
  }

  const [second, minute, hour, dayOfMonth, month, dayOfWeek, year = '*'] = fields;
  return {
    seconds: parseField(second, 0, 59),
    minutes: parseField(minute, 0, 59),
    hours: parseField(hour, 0, 23),
    dayOfMonth: parseField(dayOfMonth, 1, 31, {}, dialect === 'quartz'),
    month: parseField(month, 1, 12, MONTH_NAMES),
    dayOfWeek: parseField(dayOfWeek, 0, 7, DAY_NAMES, dialect === 'quartz', true),
    years: parseField(year, 1970, 2199),
    dialect,
  };
}

function fieldHas(field: ParsedField, value: number): boolean {
  return field.values.includes(value);
}

function dayMatches(schedule: ParsedCron, date: Date): boolean {
  if (!fieldHas(schedule.years, date.getUTCFullYear()) || !fieldHas(schedule.month, date.getUTCMonth() + 1)) {
    return false;
  }
  const dayOfMonth = fieldHas(schedule.dayOfMonth, date.getUTCDate());
  const dayOfWeek = fieldHas(schedule.dayOfWeek, date.getUTCDay());
  if (schedule.dialect !== 'quartz' && !schedule.dayOfMonth.wildcard && !schedule.dayOfWeek.wildcard) {
    return dayOfMonth || dayOfWeek;
  }
  return dayOfMonth && dayOfWeek;
}

function localDateAt(epochMilliseconds: number, timeZone: string): Date {
  const local = formatZonedDateTime(epochMilliseconds, timeZone).local;
  const [date] = local.split(' ');
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function calculateNextCronRuns(options: CronNextRunsOptions): CronRun[] {
  if (!Number.isSafeInteger(options.count) || options.count < 1 || options.count > 25) {
    throw new Error('Next-run count must be between 1 and 25.');
  }
  const afterEpoch = Date.parse(options.afterIso);
  if (!Number.isFinite(afterEpoch)) {
    throw new TypeError('Start instant must be a valid ISO date-time with an offset or Z suffix.');
  }
  const schedule = parseCronExpression(options.expression, options.dialect);
  const firstLocalDate = localDateAt(afterEpoch, options.timeZone);
  const runs: CronRun[] = [];

  for (let dayOffset = 0; dayOffset <= MAX_SEARCH_DAYS && runs.length < options.count; dayOffset++) {
    const date = new Date(firstLocalDate.getTime() + dayOffset * 86_400_000);
    if (!dayMatches(schedule, date)) {
      continue;
    }
    const datePrefix = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
    for (const hour of schedule.hours.values) {
      for (const minute of schedule.minutes.values) {
        for (const second of schedule.seconds.values) {
          let resolution;
          try {
            resolution = resolveZonedDateTime(`${datePrefix}T${pad(hour)}:${pad(minute)}:${pad(second)}`, options.timeZone);
          }
          catch (error) {
            if (error instanceof Error && error.message.includes('does not exist')) {
              continue;
            }
            throw error;
          }
          for (const epochMilliseconds of resolution.instants) {
            if (epochMilliseconds <= afterEpoch) {
              continue;
            }
            const display = formatZonedDateTime(epochMilliseconds, options.timeZone);
            runs.push(display);
            if (runs.length >= options.count) {
              break;
            }
          }
          if (runs.length >= options.count) {
            break;
          }
        }
        if (runs.length >= options.count) {
          break;
        }
      }
      if (runs.length >= options.count) {
        break;
      }
    }
  }
  if (runs.length === 0) {
    throw new Error(`No matching run was found within ${MAX_SEARCH_DAYS} days.`);
  }
  return runs.sort((left, right) => left.epochMilliseconds - right.epochMilliseconds).slice(0, options.count);
}

export function formatCronRuns(runs: CronRun[], timeZone: string): string {
  return runs.map((run, index) => (
    `${index + 1}. ${run.local} ${run.offset} (${run.abbreviation}, ${timeZone}) — ${run.isoUtc}`
  )).join('\n');
}
