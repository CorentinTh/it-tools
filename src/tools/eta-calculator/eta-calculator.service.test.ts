import { describe, expect, it } from 'vitest';
import { formatMsDuration } from './eta-calculator.service';

describe('eta-calculator', () => {
  describe('formatMsDuration', () => {
    it('should return an empty string for zero or negative durations', () => {
      expect(formatMsDuration(0)).toEqual('');
      expect(formatMsDuration(-1)).toEqual('');
    });

    it('should format durations shorter than an hour', () => {
      expect(formatMsDuration(1000)).toEqual('1 second');
      expect(formatMsDuration(42000)).toEqual('42 seconds');
      expect(formatMsDuration(3599000)).toEqual('59 minutes 59 seconds');
    });

    it('should format durations with hours', () => {
      expect(formatMsDuration(3600000)).toEqual('1 hour');
      expect(formatMsDuration(3660000)).toEqual('1 hour 1 minute');
      expect(formatMsDuration(3661000)).toEqual('1 hour 1 minute 1 second');
      expect(formatMsDuration(5400000)).toEqual('1 hour 30 minutes');
      expect(formatMsDuration(86399000)).toEqual('23 hours 59 minutes 59 seconds');
    });

    it('should append the truncated milliseconds when some are left', () => {
      expect(formatMsDuration(1500)).toEqual('1 second 500 ms');
      expect(formatMsDuration(3661500)).toEqual('1 hour 1 minute 1 second 500 ms');
      expect(formatMsDuration(1500.9)).toEqual('1 second 500 ms');
    });
  });
});
