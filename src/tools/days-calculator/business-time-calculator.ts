import type { DateTime } from 'luxon';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

const weekDayToName = {
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
  7: 'sunday',
};

export type Holiday = `${3 | 2 | 1 | 0}${number}/${1 | 0}${number}` | `${3 | 2 | 1 | 0}${number}/${1 | 0}${number}/${number}${number}${number}${number}`;

export class BusinessTime {
  private readonly businessTimezone: string;

  private readonly businessDays: DayOfWeek[];
  private readonly holidays: Holiday[];
  private readonly startOfDayTime: { hour: number; minute: number; second: number };
  private readonly endOfDayTime: { hour: number; minute: number; second: number };

  static readonly computeWorkingHours = (startHour: number, endHour: number) => {
    if (endHour < startHour) {
      const workingHours = Math.abs(Math.abs(startHour - 24) + endHour);
      return workingHours;
    }

    const workingHours = endHour - startHour;
    return workingHours;
  };

  constructor({
    businessTimezone,
    businessDays,
    businessHours,
    holidays,
  }: {
    businessTimezone: string
    businessDays: DayOfWeek[]
    businessHours: number[]
    holidays: Holiday[]
  }) {
    this.businessTimezone = businessTimezone;
    this.businessDays = businessDays;
    this.holidays = holidays;
    this.startOfDayTime = {
      hour: businessHours[0],
      minute: 0,
      second: 0,
    };
    this.endOfDayTime = {
      hour: businessHours[1],
      minute: 0,
      second: 0,
    };
  }

  computeWorkingHours = () => {
    const workingHours = BusinessTime.computeWorkingHours(
      this.startOfDayTime.hour,
      this.endOfDayTime.hour,
    );
    return workingHours;
  };

  isBusinessDay(datetime: DateTime) {
    const date = datetime.setZone(this.businessTimezone);
    if (!date.isValid) {
      throw new Error('Invalid date');
    }

    const dayMonth = date.toFormat('dd/MM') as Holiday;
    const dayMonthYear = date.toFormat('dd/MM/yyyy') as Holiday;
    if (this.holidays.includes(dayMonth) || this.holidays.includes(dayMonthYear)) {
      return false;
    }

    if (this.businessDays.includes(weekDayToName[date.weekday] as DayOfWeek)) {
      return true;
    }

    return false;
  }

  computeBusinessDaysInInterval({
    start,
    end,
  }: {
    start: DateTime
    end: DateTime
  }) {
    const businessHours = this.computeBusinessHoursInInterval({ start, end });
    const workingHours = this.computeWorkingHours();
    return businessHours / workingHours;
  }

  computeBusinessHoursInInterval({
    start,
    end,
  }: {
    start: DateTime
    end: DateTime
  }) {
    return this.computeBusinessTimeInInterval({ start, end, unit: 'hours' });
  }

  computeBusinessMinutesInInterval({
    start,
    end,
  }: {
    start: DateTime
    end: DateTime
  }) {
    return this.computeBusinessTimeInInterval({ start, end, unit: 'minutes' });
  }

  computeBusinessSecondsInInterval({
    start,
    end,
  }: {
    start: DateTime
    end: DateTime
  }) {
    return this.computeBusinessTimeInInterval({ start, end, unit: 'seconds' });
  }

  computeBusinessTimeInInterval({
    start,
    end,
    unit,
  }: {
    start: DateTime
    end: DateTime
    unit: 'hours' | 'minutes' | 'seconds'
  }) {
    if (start > end) {
      throw new Error('start date is greater than end date');
    }

    const interval = {
      start: this._moveDateInBusinessTime({ datetime: start }),
      end: this._moveDateInBusinessTime({ datetime: end }),
    };

    let datetime = interval.start;
    let businessTime = 0;

    while (datetime < interval.end) {
      if (!this.isBusinessDay(datetime)) {
        datetime = datetime.plus({ days: 1 }).set(this.startOfDayTime);
        continue;
      }

      if (datetime.toISODate() === interval.end.toISODate()) {
        businessTime += interval.end.diff(datetime).as(unit);
        datetime = interval.end;
      }
      else {
        const endOfBusinessDay = datetime.set(this.endOfDayTime);
        businessTime += endOfBusinessDay.diff(datetime).as(unit);
        datetime = datetime.plus({ days: 1 }).set(this.startOfDayTime);
      }
    }

    return businessTime;
  }

  /**
   * Move the date in a business time (moveBehind = false)
   * e.g. 06:00 => 10:00 of the current day
   * e.g. 22:00 => 10:00 of the next day
   *
   * Move the date in a business time (moveBehind = true)
   * e.g. 06:00 => 19:00 of the previous day
   * e.g. 22:00 => 19:00 of the current day
   *
   * Warning ⚠️ _moveDateInBusinessTime doesn't retain the original timezone of the datetime in input, but it returns a datetime with the same timezone used to compute business times.
   * It follows that behaviour because this method should be private and used only as helper. It is public only for testing purpose.
   */
  _moveDateInBusinessTime({
    datetime,
    moveBehind = false,
  }: {
    datetime: DateTime
    moveBehind?: boolean
  }) {
    let date = datetime.setZone(this.businessTimezone);
    const start = date.set(this.startOfDayTime);
    const end = date.set(this.endOfDayTime);

    if (date < start) {
      // Move datetime to the start / end of the business day
      date = moveBehind
        ? date.minus({ days: 1 }).set(this.endOfDayTime)
        : start;
    }
    if (date > end) {
      // Move datetime to the start of the next / previous day
      date = moveBehind
        ? date.set(this.endOfDayTime)
        : date.plus({ days: 1 }).set(this.startOfDayTime);
    }
    while (this.businessDays.length && !this.isBusinessDay(date)) {
      // Move datetime to the start of the next / previous business day
      date = moveBehind
        ? date.minus({ days: 1 }).set(this.endOfDayTime)
        : date.plus({ days: 1 }).set(this.startOfDayTime);
    }
    return date;
  }

  addBusinessHoursToDate({
    datetime,
    hours,
  }: {
    datetime: DateTime
    hours: number
  }) {
    return this.addBusinessSecondsToDate({ datetime, seconds: 3600 * hours });
  }

  addBusinessSecondsToDate({
    datetime,
    seconds,
  }: {
    datetime: DateTime
    seconds: number
  }) {
    if (seconds === 0) {
      return datetime;
    }

    let date = this._moveDateInBusinessTime({ datetime });
    let remainingSeconds = seconds;
    while (remainingSeconds > 0) {
      if (!this.isBusinessDay(date)) {
        date = date.plus({ days: 1 });
        continue;
      }

      const endOfBusinessDay = date.set(this.endOfDayTime);
      const secondsUntilEndOfBusinessDay = endOfBusinessDay
        .diff(date)
        .as('seconds');

      if (remainingSeconds <= secondsUntilEndOfBusinessDay) {
        // remaining seconds are less than 1 business day
        date = date.plus({ seconds: remainingSeconds });
        remainingSeconds = 0;
      }
      else {
        // Move to the start of the next day
        date = date.plus({ days: 1 }).set(this.startOfDayTime);
        remainingSeconds -= secondsUntilEndOfBusinessDay;
      }
    }

    return date.set({ second: 0, millisecond: 0 }).setZone(datetime.zone);
  }

  removeBusinessHoursFromDate({
    datetime,
    hours,
  }: {
    datetime: DateTime
    hours: number
  }) {
    return this.removeBusinessSecondsFromDate({
      datetime,
      seconds: 3600 * hours,
    });
  }

  removeBusinessSecondsFromDate({
    datetime,
    seconds,
  }: {
    datetime: DateTime
    seconds: number
  }) {
    if (seconds === 0) {
      return datetime;
    }

    let date = this._moveDateInBusinessTime({ datetime, moveBehind: true });
    let remainingSeconds = seconds;
    while (remainingSeconds > 0) {
      if (!this.isBusinessDay(date)) {
        date = date.minus({ days: 1 });
        continue;
      }

      const startOfBusinessDay
        = date.hour === 0 && date.minute === 0
          ? date.minus({ days: 1 }).set(this.startOfDayTime)
          : date.set(this.startOfDayTime);
      const secondsFromStartOfBusinessDay = date
        .diff(startOfBusinessDay)
        .as('seconds');

      if (remainingSeconds <= secondsFromStartOfBusinessDay) {
        // remaining seconds are less than 1 business day
        date = date.minus({ seconds: remainingSeconds });
        remainingSeconds = 0;
      }
      else {
        // Move to the end of the previous day
        date = date.minus({ days: 1 });

        // handle special case 24h business days. If it is midnight and endOfDayTime is midnight, we must not set the date to the end of the day, otherwise we lose the effect of removing 1 day
        if (
          !(
            date.hour === 0
            && date.minute === 0
            && this.endOfDayTime.hour === 24
          )
        ) {
          date = date.set(this.endOfDayTime);
        }
        remainingSeconds -= secondsFromStartOfBusinessDay;
      }
    }

    return date.set({ second: 0, millisecond: 0 }).setZone(datetime.zone);
  }

  hoursToDays(hours: number) {
    const days = hours / this.computeWorkingHours();
    return days;
  }
}
