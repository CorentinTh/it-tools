import { describe, expect, it } from 'vitest';
import { formatMs } from './chronometer.service';

describe('chronometer', () => {
  describe('formatChronometerTime', () => {
    it('format the elapsed time', () => {
      expect(formatMs(0)).toEqual('00:00.000');
      expect(formatMs(1)).toEqual('00:00.001');
      expect(formatMs(123456)).toEqual('02:03.456');
      expect(formatMs(12345600)).toEqual('03:25:45.600');
    });
  });
});
