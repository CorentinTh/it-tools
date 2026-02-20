import { describe, expect, it } from 'vitest';
import { addToDate } from './date-duration-calculator.service';

describe('date-duration-calculator', () => {
  describe('addToDate', () => {
    it('compute right values', () => {
      expect(addToDate(new Date('2024-08-15T07:21:46Z'), '+1d 1m 20s')).to.deep.eq(
        {
          date: new Date('2024-08-16T07:23:06.000Z'),
          durationPretty: '1d 1m 20s',
          durationSeconds: 86480,
          errors: [],
        },
      );
    });
  });
});
