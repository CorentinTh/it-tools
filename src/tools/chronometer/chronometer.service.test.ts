import { describe, expect, it } from 'vitest';
import { formatChronometerTime } from './chronometer.service';

describe('chronometer', () => {
  describe('formatChronometerTime', () => {
    it('format the elapsed time', () => {
      expect(formatChronometerTime({ elapsed: 123456 })).toEqual('02:03.456');
      expect(formatChronometerTime({ elapsed: 123456, msPerUnit: 100 })).toEqual('03:25:45.600');
      expect(formatChronometerTime({ elapsed: 12345600 })).toEqual('03:25:45.600');
    });
  });
});
