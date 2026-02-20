import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import type { DayOfWeek, Holiday } from './business-time-calculator';
import { BusinessTime } from './business-time-calculator';

const weekDays: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
];

const allDays: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

interface TestCase {
  businessTimezone: string
  businessDays: DayOfWeek[]
  businessHours: number[]
  holidays: Holiday[]
  start?: string
  end?: string
  expected: any
}

type BusinessTimeMethod = keyof InstanceType<typeof BusinessTime>;

function testEachComputeTime(testCases: TestCase[],
  businessTimeFunctionName: BusinessTimeMethod) {
  for (const {
    start,
    end,
    businessTimezone,
    businessHours,
    businessDays,
    holidays,
    expected,
  } of testCases) {
    if (!start || !end) {
      throw new Error('Start and end dates must be defined');
    }

    const startDatetime = DateTime.fromISO(start) as DateTime;
    if (!startDatetime.isValid) {
      throw new Error(`Invalid start datetime: ${start}`);
    }
    const endDatetime = DateTime.fromISO(end) as DateTime;
    if (!endDatetime.isValid) {
      throw new Error(`Invalid end datetime: ${end}`);
    }
    const businessTime = new BusinessTime({
      businessTimezone,
      businessHours,
      businessDays,
      holidays,
    });

    expect(
      businessTime[businessTimeFunctionName]({
        start: startDatetime,
        end: endDatetime,
      } as never)).to.deep.eq(expected);
  }
}

function testEachMoveDateInBusinessTime(testCases: (TestCase & { datetime: string; moveBehind: boolean })[]) {
  for (const {
    businessTimezone,
    businessHours,
    businessDays,
    holidays,
    datetime,
    moveBehind,
    expected,
  } of testCases) {
    const businessTime = new BusinessTime({
      businessTimezone,
      businessHours,
      businessDays,
      holidays,
    });

    expect(
      businessTime
        ._moveDateInBusinessTime({
          datetime: DateTime.fromISO(datetime),
          moveBehind,
        })
        .toISO()).to.deep.eq(
      expected,
    );
  }
}

function testEachIsBusinessDay(testCases: (TestCase & { datetime: string })[]) {
  for (const {
    datetime,
    businessTimezone,
    businessHours,
    businessDays,
    holidays,
    expected,
  } of testCases) {
    const datetimeObj = DateTime.fromISO(datetime) as DateTime;
    if (!datetimeObj.isValid) {
      throw new Error(`Invalid datetime: ${datetime}`);
    }
    const businessTime = new BusinessTime({
      businessTimezone,
      businessHours,
      businessDays,
      holidays,
    });

    expect(businessTime.isBusinessDay(datetimeObj)).to.deep.eq(expected);
  }
}

function testEachAddBusinessSecondsToDate(testCases: (TestCase & { datetime: string; seconds: number })[]) {
  for (const {
    seconds,
    businessTimezone,
    businessHours,
    businessDays,
    holidays,
    datetime,
    expected,
  } of testCases) {
    const datetimeObj = DateTime.fromISO(datetime) as DateTime;
    if (!datetimeObj.isValid) {
      throw new Error(`Invalid datetime: ${datetime}`);
    }
    const businessTime = new BusinessTime({
      businessTimezone,
      businessHours,
      businessDays,
      holidays,
    });

    expect(
      businessTime
        .addBusinessSecondsToDate({ datetime: datetimeObj, seconds })
        .toISO()).to.deep.eq(
      expected,
    );
  }
}

function testEachRemoveBusinessSecondsToDate(testCases: (TestCase & { datetime: string; seconds: number })[]) {
  for (const {
    seconds,
    businessTimezone,
    businessHours,
    businessDays,
    holidays,
    datetime,
    expected,
  } of testCases) {
    const datetimeObj = DateTime.fromISO(datetime) as DateTime;
    if (!datetimeObj.isValid) {
      throw new Error(`Invalid datetime: ${datetime}`);
    }
    const businessTime = new BusinessTime({
      businessTimezone,
      businessHours,
      businessDays,
      holidays,
    });

    expect(
      businessTime
        .removeBusinessSecondsFromDate({ datetime: datetimeObj, seconds })
        .toISO()).to.deep.eq(
      expected,
    );
  }
}

describe('BusinessTime', () => {
  it('compute business days', () => {
    testEachComputeTime(
      [
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: [],
          start: '2020-12-28T09:00:00.000+01:00',
          end: '2020-12-29T23:00:00.000+01:00',
          expected: 2,
        },
      ],
      'computeBusinessDaysInInterval',
    );
  });

  it('compute business hours', () => {
    testEachComputeTime(
      [
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: [],
          start: '2020-12-28T13:45:00.000+01:00',
          end: '2020-12-28T14:00:00.000+01:00',
          expected: 0.25,
        }, // same hour
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: ['25/12', '26/12'],
          start: '2020-12-25T10:45:00.000+01:00',
          end: '2020-12-27T10:00:00.000+01:00',
          expected: 0,
        }, // holidays days
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: ['25/12/2020', '26/12/2020'],
          start: '2020-12-25T10:45:00.000+01:00',
          end: '2020-12-27T10:00:00.000+01:00',
          expected: 0,
        }, // holidays days and dates
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: ['25/12/2022', '26/12/2022'],
          start: '2020-12-25T10:45:00.000+01:00',
          end: '2020-12-27T10:00:00.000+01:00',
          expected: 8.25,
        }, // holidays days and dates (wrong year)
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: [],
          start: '2020-12-28T14:00:00.000+01:00',
          end: '2020-12-28T18:30:00.000+01:00',
          expected: 4.5,
        }, // same day
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: [],
          start: '2020-12-18T14:00:00.000+01:00',
          end: '2020-12-21T14:30:00.000+01:00',
          expected: 9.5,
        }, // cross weekend
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: [],
          start: '2020-12-28T15:00:00.000+01:00',
          end: '2020-12-28T20:00:00.000+01:00',
          expected: 4,
        }, // 4 hours in Rome
        {
          businessTimezone: 'America/Los_Angeles',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: [],
          start: '2020-12-28T15:00:00.000+01:00',
          end: '2020-12-28T20:00:00.000+01:00',
          expected: 1,
        }, // 1 hour in San Francisco
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: [],
          start: '2021-01-04T10:00:00.000+01:00',
          end: '2021-03-01T10:00:00.000+01:00',
          expected: 360,
        }, // 8 weeks, 45 hours / week => 360
      ],
      'computeBusinessHoursInInterval',
    );
  });

  it('compute business minutes', () => {
    testEachComputeTime(
      [
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: [],
          start: '2020-12-28T13:45:00.000+01:00',
          end: '2020-12-28T14:00:00.000+01:00',
          expected: 15,
        },
        {
          businessTimezone: 'Europe/Rome',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: ['01/01'],
          start: '2020-12-31T13:45:00.000+01:00',
          end: '2021-01-04T19:00:00.000+01:00',
          expected: 855,
        },
      ],
      'computeBusinessMinutesInInterval',
    );
  });

  it('compute business seconds', () => {
    testEachComputeTime(
      [
        {
          businessTimezone: 'America/Los_Angeles',
          businessDays: weekDays,
          businessHours: [10, 19],
          holidays: [],
          start: '2020-12-28T15:00:00.000+01:00',
          end: '2020-12-28T20:00:00.000+01:00',
          expected: 3600,
        }, // 1 hour in San Francisco
      ],
      'computeBusinessSecondsInInterval',
    );
  });

  it('compute isBusinessDay', () => {
    testEachIsBusinessDay([
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday'],
        businessHours: [10, 19],
        holidays: ['25/12', '26/12'],
        datetime: '2020-12-28T14:00:00.000+01:00',
        expected: true,
      }, // monday
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday', 'friday'],
        businessHours: [10, 19],
        holidays: ['26/12'],
        datetime: '2020-12-25T14:00:00.000+01:00',
        expected: true,
      }, // Christmas 2020 (friday) configured as business day
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday'],
        holidays: ['25/12', '26/12'],
        businessHours: [10, 19],
        datetime: '2020-12-27T14:00:00.000+01:00',
        expected: false,
      }, // tuesday configured as rest day
      {
        businessTimezone: 'America/Los_Angeles',
        businessDays: ['monday'],
        businessHours: [10, 19],
        holidays: ['25/12', '26/12'],
        datetime: '2020-12-28T01:00:00.000+01:00',
        expected: false,
      }, // monday in Rome, sunday in San Francisco
    ]);
  });

  it('compute moveDateInBusinessTime', () => {
    testEachMoveDateInBusinessTime([
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday'],
        businessHours: [13, 15],
        holidays: [],
        moveBehind: false,
        datetime: '2020-12-28T11:00:00.000+01:00',
        expected: '2020-12-28T13:00:00.000+01:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday'],
        businessHours: [13, 15],
        holidays: [],
        moveBehind: false,
        datetime: '2020-12-28T14:00:00.000+01:00',
        expected: '2020-12-28T14:00:00.000+01:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday'],
        businessHours: [13, 15],
        holidays: ['01/01'],
        moveBehind: false,
        datetime: '2020-12-28T16:00:00.000+01:00',
        expected: '2021-01-04T13:00:00.000+01:00',
      },
      {
        businessTimezone: 'America/Los_Angeles',
        businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        businessHours: [10, 19],
        holidays: [],
        moveBehind: false,
        datetime: '2021-06-15T00:00:00.000+02:00', // tuesday
        expected: '2021-06-14T15:00:00.000-07:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday', 'tuesday'],
        businessHours: [13, 15],
        holidays: [],
        moveBehind: true,
        datetime: '2022-04-12T11:00:00.000+02:00',
        expected: '2022-04-11T15:00:00.000+02:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday'],
        businessHours: [13, 15],
        holidays: [],
        moveBehind: true,
        datetime: '2020-12-28T14:00:00.000+01:00',
        expected: '2020-12-28T14:00:00.000+01:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday'],
        businessHours: [13, 15],
        holidays: ['01/01'],
        moveBehind: true,
        datetime: '2022-04-11T11:00:00.000+02:00',
        expected: '2022-04-04T15:00:00.000+02:00',
      },
      {
        businessTimezone: 'America/Los_Angeles',
        businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        businessHours: [10, 19],
        holidays: [],
        moveBehind: true,
        datetime: '2021-06-15T00:00:00.000+02:00', // tuesday
        expected: '2021-06-14T15:00:00.000-07:00',
      },
    ]);
  });

  it('add business seconds to date', () => {
    testEachAddBusinessSecondsToDate([
      {
        businessTimezone: 'Europe/Rome',
        businessDays: weekDays,
        businessHours: [10, 19],
        holidays: [],
        datetime: '2020-12-28T10:45:00.000+01:00',
        seconds: 3600 * 10,
        expected: '2020-12-29T10:45:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: weekDays,
        businessHours: [10, 19],
        holidays: [],
        datetime: '2022-04-04T19:45:00.000+02:00',
        seconds: 3600 * 10,
        expected: '2022-04-06T09:00:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: allDays,
        businessHours: [0, 24],
        holidays: ['01/01'],
        datetime: '2020-12-28T10:45:00.000+01:00',
        seconds: 3600 * 96,
        expected: '2021-01-02T09:45:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: allDays,
        businessHours: [0, 24],
        holidays: [],
        datetime: '2020-12-28T10:45:00.000+01:00',
        seconds: 3600 * 96,
        expected: '2021-01-01T09:45:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: allDays,
        businessHours: [0, 12],
        holidays: [],
        datetime: '2020-12-28T10:45:00.000+01:00',
        seconds: 3600 * 24,
        expected: '2020-12-30T09:45:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: allDays,
        businessHours: [0, 12],
        holidays: [],
        datetime: '2022-04-11T18:00:00.000+02:00',
        seconds: 3600 * 24,
        expected: '2022-04-13T10:00:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: allDays,
        businessHours: [12, 24],
        holidays: [],
        datetime: '2022-04-04T10:00:00.000+02:00',
        seconds: 3600 * 24,
        expected: '2022-04-05T22:00:00.000+00:00',
      },
    ]);
  });

  it('remove business seconds from date', () => {
    testEachRemoveBusinessSecondsToDate([
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        businessHours: [10, 19],
        holidays: [],
        datetime: '2020-12-28T10:45:00.000+01:00',
        seconds: 3600 * 10,
        expected: '2020-12-24T17:45:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        businessHours: [10, 19],
        holidays: [],
        datetime: '2022-04-08T19:45:00.000+02:00',
        seconds: 3600 * 10,
        expected: '2022-04-07T16:00:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: allDays,
        businessHours: [0, 24],
        holidays: ['25/12'],
        datetime: '2020-12-28T10:11:11.111+01:00',
        seconds: 3600 * 96, // 4 days
        expected: '2020-12-23T09:11:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], // handle weekend
        businessHours: [0, 24],
        holidays: [],
        datetime: '2022-04-11T12:00:00.000+02:00',
        seconds: 3600 * 48, // 2 days
        expected: '2022-04-07T10:00:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], // handle weekend
        businessHours: [1, 24],
        holidays: [],
        datetime: '2022-04-11T12:00:00.000+02:00',
        seconds: 3600 * 48, // 2 days
        expected: '2022-04-07T08:00:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: allDays,
        businessHours: [0, 12],
        holidays: [],
        datetime: '2022-04-08T10:45:00.000+02:00',
        seconds: 3600 * 24,
        expected: '2022-04-06T08:45:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: allDays,
        businessHours: [0, 12],
        holidays: [],
        datetime: '2022-04-08T18:00:00.000+02:00',
        seconds: 3600 * 24,
        expected: '2022-04-06T22:00:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: allDays,
        businessHours: [12, 24],
        holidays: [],
        datetime: '2022-04-08T10:00:00.000+02:00',
        seconds: 3600 * 24,
        expected: '2022-04-06T10:00:00.000+00:00',
      },
      {
        businessTimezone: 'Europe/Rome',
        businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], // handle weekend
        businessHours: [12, 24],
        holidays: [],
        datetime: '2022-04-11T10:00:00.000+02:00',
        seconds: 3600 * 24,
        expected: '2022-04-07T10:00:00.000+00:00',
      },
    ]);
  });

  it('compute working hours', () => {
    expect(BusinessTime.computeWorkingHours(10, 19)).toBe(9);
    expect(BusinessTime.computeWorkingHours(0, 24)).toBe(24);
    expect(BusinessTime.computeWorkingHours(18, 3)).toBe(9);
    expect(BusinessTime.computeWorkingHours(22, 0)).toBe(2);
  });
});
