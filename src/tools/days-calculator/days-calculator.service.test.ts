import { describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { countCertainDays, datesByDays, diffDateTimes } from './days-calculator.service';

describe('days-calculator', () => {
  describe('diffDateTimes', () => {
    it('compute right values', () => {
      const daysInfos = {
        saturdays: [
          '2024-08-03',
          '2024-08-10',
          '2024-08-17',
          '2024-08-24',
          '2024-08-31',
        ],
        tuesdays: [
          '2024-08-06',
          '2024-08-13',
          '2024-08-20',
          '2024-08-27',
        ],
        sundays: [
          '2024-08-04',
          '2024-08-11',
          '2024-08-18',
          '2024-08-25',
        ],
        mondays: [
          '2024-08-05',
          '2024-08-12',
          '2024-08-19',
          '2024-08-26',
        ],
        fridays: [
          '2024-08-02',
          '2024-08-09',
          '2024-08-16',
          '2024-08-23',
          '2024-08-30',
        ],

        wednesdays: [
          '2024-08-07',
          '2024-08-14',
          '2024-08-21',
          '2024-08-28',
        ],
        thursdays: [
          '2024-08-01',
          '2024-08-08',
          '2024-08-15',
          '2024-08-22',
          '2024-08-29',
        ],
        weekendDays: 9,
        weekends: 4,
      };
      const holidays = [
        {
          date: '2024-08-15 00:00:00',
          end: new Date('2024-08-15T22:00:00.000Z'),
          name: 'Assomption',
          rule: '08-15',
          start: new Date('2024-08-14T22:00:00.000Z'),
          type: 'public',
        },
      ];
      const totalDiff1 = {
        totalDifference: {
          days: 30.416666666666668,
          hours: 730,
          minutes: 43800,
          months: 0.9811827956989247,
          seconds: 2628000,
          weeks: 4.345238095238095,
          years: 0.08333333333333333,
        },
      };

      const date1 = new Date('2024-08-01T07:21:46Z');
      const date2 = new Date('2024-08-31T17:21:46Z');

      expect(diffDateTimes({
        date1,
        date2,
        country: 'FR',
        businessTimezone: 'Europe/Paris',
        includeWeekDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        includeEndDate: true,
        includeHolidays: true,
        businessStartHour: 9,
        businessEndHour: 18,
      })).to.deep.eq({
        startDate: date1,
        endDate: date2,
        businessDays: 29.959691358024696,
        businessHours: 269.63722222222225,
        businessSeconds: 970694,
        businessSecondsFormatted: '11d 5h 38m 14s',
        differenceFormatted: '29d 10h',
        differenceSeconds: 2541600,
        ...totalDiff1,
        totalDifferenceFormatted: '30d 10h',
        holidays,
        ...daysInfos,
      });
      expect(diffDateTimes({
        date1,
        date2,
        country: 'FR',
        businessTimezone: 'Europe/Paris',
        includeEndDate: false,
        includeWeekDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        includeHolidays: true,
        businessStartHour: 9,
        businessEndHour: 18,
      })).to.deep.eq({
        startDate: date1,
        endDate: new Date('2024-08-30T23:59:59.999Z'),
        businessDays: 28.959722191358026,
        businessHours: 260.63749972222223,
        businessSeconds: 938294.999,
        businessSecondsFormatted: '10d 20h 38m 14.9s',
        differenceFormatted: '28d 16h 38m 13.9s',
        differenceSeconds: 2479093.999,
        totalDifference: {
          days: 29.69321758101852,
          hours: 712.6372219444445,
          minutes: 42758.233316666665,
          months: 0.9578457284199522,
          seconds: 2565493.999,
          weeks: 4.241888225859788,
          years: 0.08135128104388635,
        },
        totalDifferenceFormatted: '29d 16h 38m 13.9s',
        holidays,
        ...daysInfos,
        saturdays: [
          '2024-08-03',
          '2024-08-10',
          '2024-08-17',
          '2024-08-24',
        ],
      });
      expect(diffDateTimes({
        date1,
        date2,
        country: 'FR',
        businessTimezone: 'Europe/Paris',
        includeEndDate: true,
        includeWeekDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        includeHolidays: false,
        businessStartHour: 9,
        businessEndHour: 18,
      })).to.deep.eq({
        startDate: date1,
        endDate: date2,
        businessDays: 21.959691358024692,
        businessHours: 197.63722222222222,
        businessSeconds: 711494,
        businessSecondsFormatted: '8d 5h 38m 14s',
        differenceFormatted: '21d 14h 38m 14s',
        differenceSeconds: 1867094,
        ...totalDiff1,
        totalDifferenceFormatted: '30d 10h',
        holidays,
        ...daysInfos,
      });
      expect(diffDateTimes({
        date1,
        date2,
        country: 'FR',
        businessTimezone: 'Europe/Paris',
        includeEndDate: true,
        includeWeekDays: ['monday'],
        includeHolidays: false,
        businessStartHour: 9,
        businessEndHour: 18,
      })).to.deep.eq({
        startDate: date1,
        endDate: date2,
        businessDays: 4,
        businessHours: 36,
        businessSeconds: 129600,
        businessSecondsFormatted: '1d 12h',
        differenceFormatted: '4d',
        differenceSeconds: 345600,
        totalDifferenceFormatted: '30d 10h',
        ...totalDiff1,
        holidays,
        ...daysInfos,
      });
    });
  });
  describe('countCertainDays', () => {
    it('compute right number of days', () => {
      expect(countCertainDays([1, 3, 5], new Date(2014, 8, 1), new Date(2014, 8, 1))).toBe(1);
      expect(countCertainDays([1, 3, 5], new Date(2014, 8, 1), new Date(2014, 8, 2))).toBe(1);
      expect(countCertainDays([1, 3, 5], new Date(2014, 8, 1), new Date(2014, 8, 3))).toBe(2);
      expect(countCertainDays([1, 3, 5], new Date(2014, 8, 1), new Date(2014, 8, 4))).toBe(2);
      expect(countCertainDays([1, 3, 5], new Date(2014, 8, 1), new Date(2014, 8, 5))).toBe(3);
      expect(countCertainDays([1, 3, 5], new Date(2014, 8, 1), new Date(2014, 8, 6))).toBe(3);
      expect(countCertainDays([1, 3, 5], new Date(2014, 8, 1), new Date(2014, 8, 7))).toBe(3);
    });
  });
  describe('datesByDays', () => {
    it('compute week days dates', () => {
      expect(datesByDays(DateTime.utc(2014, 8, 1), DateTime.utc(2014, 8, 31))).to.deep.eq({
        1: [
          '2014-08-04',
          '2014-08-11',
          '2014-08-18',
          '2014-08-25',
        ],
        2: [
          '2014-08-05',
          '2014-08-12',
          '2014-08-19',
          '2014-08-26',
        ],
        3: [
          '2014-08-06',
          '2014-08-13',
          '2014-08-20',
          '2014-08-27',
        ],
        4: [
          '2014-08-07',
          '2014-08-14',
          '2014-08-21',
          '2014-08-28',
        ],
        5: [
          '2014-08-01',
          '2014-08-08',
          '2014-08-15',
          '2014-08-22',
          '2014-08-29',
        ],
        6: [
          '2014-08-02',
          '2014-08-09',
          '2014-08-16',
          '2014-08-23',
          '2014-08-30',
        ],
        7: [
          '2014-08-03',
          '2014-08-10',
          '2014-08-17',
          '2014-08-24',
          '2014-08-31',
        ],
      });
    });
  });
});
