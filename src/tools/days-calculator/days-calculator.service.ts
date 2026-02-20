import { DateTime, Interval } from 'luxon';
import prettyMilliseconds from 'pretty-ms';
import Holidays, { type HolidaysTypes } from 'date-holidays';
import _ from 'lodash';
import { BusinessTime, type Holiday } from './business-time-calculator';

interface DateTimeRange {
  startDate: Date
  endDate: Date
  totalDifference: {
    years: number
    months: number
    weeks: number
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  totalDifferenceFormatted: string
  differenceSeconds: number
  differenceFormatted: string
  businessSeconds: number
  businessSecondsFormatted: string
  businessHours: number
  businessDays: number
  mondays: string[]
  tuesdays: string[]
  wednesdays: string[]
  thursdays: string[]
  fridays: string[]
  saturdays: string[]
  sundays: string[]
  weekendDays: number
  weekends: number
  holidays: HolidaysTypes.Holiday[]
}

export type Weekdays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export const allDays: Weekdays[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
export const allWeekDays: Weekdays[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export function diffDateTimes({
  date1,
  date2,
  country, state = undefined, region = undefined,
  businessTimezone,
  includeEndDate = true,
  includeWeekDays = allWeekDays,
  includeHolidays = true,
  businessStartHour = 9,
  businessEndHour = 18,

}: {
  date1: Date
  date2: Date
  country: string
  state?: string
  region?: string
  includeEndDate?: boolean
  includeWeekDays?: Array<Weekdays>
  includeHolidays?: boolean
  businessStartHour: number
  businessEndHour: number
  businessTimezone: string
}): DateTimeRange {
  function getHolidaysBetween(date1: DateTime, date2: DateTime) {
    const startDateTime = date1.startOf('day');
    const endDateTime = date2.endOf('day');
    const hd = new Holidays(country, state || '', region || '');
    let holidays: Array<HolidaysTypes.Holiday> = [];
    for (let year = startDateTime.year; year <= endDateTime.year; year += 1) {
      holidays = [...holidays, ...hd.getHolidays(year)];
    }

    const range = Interval.fromDateTimes(startDateTime, endDateTime);
    return holidays.filter(h => range.contains(DateTime.fromJSDate(h.start)));
  }

  const startDateTime = DateTime.fromJSDate(date1);
  let endDateTime = DateTime.fromJSDate(date2);
  if (!includeEndDate) {
    endDateTime = endDateTime.minus({ days: 1 }).endOf('day');
  }
  if (endDateTime < startDateTime) {
    endDateTime = startDateTime;
  }

  const holidays = getHolidaysBetween(startDateTime, endDateTime);
  const holidaysDates = holidays.map(h => DateTime.fromJSDate(h.start).toFormat('dd/MM/yyyy') as Holiday);

  const differenceTimeComputer = new BusinessTime({
    businessDays: includeWeekDays,
    businessTimezone,
    holidays: includeHolidays ? holidaysDates : [],
    businessHours: [0, 24],
  });
  const businessTimeComputer = new BusinessTime({
    businessDays: includeWeekDays,
    businessTimezone,
    holidays: includeHolidays ? holidaysDates : [],
    businessHours: [businessStartHour, businessEndHour],
  });

  const startEnd = { start: startDateTime, end: endDateTime };

  const totalDifferenceSeconds = endDateTime.diff(startDateTime, 'seconds').toObject().seconds || 0;
  const totalDifferenceMinutes = endDateTime.diff(startDateTime, 'minutes').toObject().minutes || 0;
  const totalDifferenceHours = endDateTime.diff(startDateTime, 'hours').toObject().hours || 0;
  const totalDifferenceDays = endDateTime.diff(startDateTime, 'days').toObject().days || 0;
  const totalDifferenceWeeks = endDateTime.diff(startDateTime, 'weeks').toObject().weeks || 0;
  const totalDifferenceMonths = endDateTime.diff(startDateTime, 'months').toObject().months || 0;
  const totalDifferenceYears = endDateTime.diff(startDateTime, 'years').toObject().years || 0;
  const differenceSeconds = differenceTimeComputer.computeBusinessSecondsInInterval(startEnd);
  const businessSeconds = businessTimeComputer.computeBusinessSecondsInInterval(startEnd);
  const weekDaysDates = datesByDays(startDateTime, endDateTime);
  const weekendDays = countCertainDays([6, 0], date1, date2);
  return {
    startDate: startDateTime.toJSDate(),
    endDate: endDateTime.toJSDate(),
    totalDifference: {
      years: totalDifferenceYears,
      months: totalDifferenceMonths,
      weeks: totalDifferenceWeeks,
      days: totalDifferenceDays,
      hours: totalDifferenceHours,
      minutes: totalDifferenceMinutes,
      seconds: totalDifferenceSeconds,
    },
    totalDifferenceFormatted: prettyMilliseconds(totalDifferenceSeconds * 1000),
    differenceSeconds,
    differenceFormatted: prettyMilliseconds(differenceSeconds * 1000),
    businessSeconds,
    businessSecondsFormatted: prettyMilliseconds(businessSeconds * 1000),
    businessHours: businessTimeComputer.computeBusinessHoursInInterval(startEnd),
    businessDays: businessTimeComputer.computeBusinessDaysInInterval(startEnd),
    mondays: weekDaysDates['1'] || [],
    tuesdays: weekDaysDates['2'] || [],
    wednesdays: weekDaysDates['3'] || [],
    thursdays: weekDaysDates['4'] || [],
    fridays: weekDaysDates['5'] || [],
    saturdays: weekDaysDates['6'] || [],
    sundays: weekDaysDates['7'] || [],
    weekendDays,
    weekends: Math.floor(weekendDays / 2),
    holidays,
  };
}

// days is an array of weekdays: 0 is Sunday, ..., 6 is Saturday
export function countCertainDays(days: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>, d0: Date, d1: Date) {
  const ndays = 1 + Math.round((d1.getTime() - d0.getTime()) / (24 * 3600 * 1000));
  const sum = function (a: number, b: number) {
    return a + Math.floor((ndays + (d0.getDay() + 6 - b) % 7) / 7);
  };
  return days.reduce(sum, 0);
}

export function datesByDays(startDateTime: DateTime, endDateTime: DateTime) {
  const dates = Interval.fromDateTimes(startDateTime.startOf('day'), endDateTime.endOf('day')).splitBy({ day: 1 }).map(d => d.start);
  return _.chain(dates)
    .groupBy(d => d?.weekday)
    .map((dates, weekday) => ({ weekday, dates }))
    .reduce((prev, curr) => ({ ...prev, [curr.weekday]: mapToJSDate(curr.dates) }), {} as { [weekday: string]: string[] })
    .value();
}
function mapToJSDate(dates: (DateTime | null)[]): string[] {
  return dates.map(d => d?.toISODate() || '').filter(d => d);
}

export function getSupportedCountries() {
  const hd = new Holidays();
  return Object.entries(hd.getCountries()).map(([code, name]) => ({ value: code, label: name }));
}

export function getSupportedStates(country: string) {
  const hd = new Holidays();
  return Object.entries(hd.getStates(country) || []).map(([code, name]) => ({ value: code, label: name }));
}

export function getSupportedRegions(country: string, state: string) {
  const hd = new Holidays();
  return Object.entries(hd.getRegions(country, state) || []).map(([code, name]) => ({ value: code, label: name }));
}
