import { describe, expect, it } from 'vitest';
import { calculateNextCronRuns, formatCronRuns, parseCronExpression } from './cron-next-runs.service';

describe('cron dialect parsing', () => {
  it.each([
    ['*/15 * * * *', 'unix'],
    ['0 */10 * * * *', 'seconds'],
    ['0 0 9 ? * MON-FRI', 'quartz'],
    ['0 0 9 ? JAN MON-FRI 2027', 'quartz'],
    ['@daily', 'unix'],
  ] as const)('accepts %s as %s', (expression, dialect) => {
    expect(() => parseCronExpression(expression, dialect)).not.toThrow();
  });

  it.each([
    ['* * * *', 'unix', 'five fields'],
    ['* * * * *', 'seconds', 'six fields'],
    ['0 0 9 * * MON#2', 'quartz', 'not supported'],
    ['0 0 * * FUNDAY', 'unix', 'between'],
    ['@reboot', 'unix', 'calculable'],
  ] as const)('rejects %s as %s', (expression, dialect, message) => {
    expect(() => parseCronExpression(expression, dialect)).toThrow(message);
  });
});

describe('cron next runs', () => {
  it('calculates Unix steps after an exclusive start instant', () => {
    const runs = calculateNextCronRuns({
      expression: '*/15 * * * *',
      dialect: 'unix',
      timeZone: 'UTC',
      afterIso: '2026-01-01T00:07:00.000Z',
      count: 4,
    });
    expect(runs.map(run => run.isoUtc)).toEqual([
      '2026-01-01T00:15:00.000Z',
      '2026-01-01T00:30:00.000Z',
      '2026-01-01T00:45:00.000Z',
      '2026-01-01T01:00:00.000Z',
    ]);
  });

  it('supports seconds without scanning every elapsed second', () => {
    const runs = calculateNextCronRuns({
      expression: '*/10 * * * * *',
      dialect: 'seconds',
      timeZone: 'UTC',
      afterIso: '2026-01-01T00:00:07.000Z',
      count: 3,
    });
    expect(runs.map(run => run.isoUtc)).toEqual([
      '2026-01-01T00:00:10.000Z',
      '2026-01-01T00:00:20.000Z',
      '2026-01-01T00:00:30.000Z',
    ]);
  });

  it('calculates Quartz weekday schedules in a selected timezone', () => {
    const runs = calculateNextCronRuns({
      expression: '0 0 9 ? * MON-FRI',
      dialect: 'quartz',
      timeZone: 'America/New_York',
      afterIso: '2026-01-02T15:00:00.000Z',
      count: 2,
    });
    expect(runs.map(run => run.isoUtc)).toEqual([
      '2026-01-05T14:00:00.000Z',
      '2026-01-06T14:00:00.000Z',
    ]);
    expect(formatCronRuns(runs, 'America/New_York')).toContain('America/New_York');
  });

  it('skips nonexistent DST times and includes both repeated occurrences', () => {
    const spring = calculateNextCronRuns({
      expression: '30 2 * * *',
      dialect: 'unix',
      timeZone: 'America/New_York',
      afterIso: '2024-03-10T05:00:00.000Z',
      count: 1,
    });
    expect(spring[0].local).toBe('2024-03-11 02:30:00');

    const fall = calculateNextCronRuns({
      expression: '30 1 * * *',
      dialect: 'unix',
      timeZone: 'America/New_York',
      afterIso: '2024-11-03T04:00:00.000Z',
      count: 2,
    });
    expect(fall[0].local).toBe('2024-11-03 01:30:00');
    expect(fall[1].local).toBe('2024-11-03 01:30:00');
    expect(fall[1].epochMilliseconds - fall[0].epochMilliseconds).toBe(3_600_000);
  });

  it('uses Unix OR semantics when both day fields are constrained', () => {
    const runs = calculateNextCronRuns({
      expression: '0 0 13 * MON',
      dialect: 'unix',
      timeZone: 'UTC',
      afterIso: '2026-01-12T00:00:00.000Z',
      count: 2,
    });
    expect(runs.map(run => run.local.slice(0, 10))).toEqual(['2026-01-13', '2026-01-19']);
  });
});
