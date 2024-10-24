import { describe, expect, it } from 'vitest';
import { getWeekOfMonth } from 'date-fns';
import { getFirstMondayFromISOWeek, getFirstMondayFromMonthWeek } from './week-number-converter.service';

describe('week-number-converter', () => {
  describe('getFirstMondayFromISOWeek', () => {
    it('return right monday date from week number', () => {
      expect(getFirstMondayFromISOWeek(11, 2022).toString()).toBe('Mon Mar 14 2022');
      expect(getFirstMondayFromISOWeek(1, 2023).toString()).toBe('Mon Jan 02 2023');
      expect(getFirstMondayFromISOWeek(53, 2026).toString()).toBe('Mon Dec 28 2026');
    });
  });
  describe('getFirstMondayFromMonthWeek', () => {
    it('return right date from month week number', () => {
      expect(getFirstMondayFromMonthWeek(getWeekOfMonth(new Date('Mon Mar 14 2022')), 3, 2022).toString()).toBe('Mon Mar 14 2022');
      expect(getFirstMondayFromMonthWeek(getWeekOfMonth(new Date('Mon Jan 02 2023')), 1, 2023).toString()).toBe('Mon Jan 02 2023');
      expect(getFirstMondayFromMonthWeek(getWeekOfMonth(new Date('Mon Dec 28 2026')), 12, 2022).toString()).toBe('Mon Dec 28 2026');
    });
  });
});
