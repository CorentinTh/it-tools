import { describe, expect, it } from 'vitest';
import { getCronType, getLastExecutionTimes, isCronValid } from './crontab-generator.service';

describe('crontab-generator', () => {
  describe('isCronValid', () => {
    it('should return true for all valid formats', () => {
      expect(isCronValid('0 0 * * 1-5')).toBe(true);
      expect(isCronValid('23 0-20/2 * * *')).toBe(true);

      // AWS formats
      expect(isCronValid('0 11-22 ? * MON-FRI *')).toBe(true);
      expect(isCronValid('0 0 ? * 1 *')).toBe(true);
    });
    it('should return false for all invalid formats', () => {
      expect(isCronValid('aert')).toBe(false);
      expect(isCronValid('40 *')).toBe(false);
    });
  });

  describe('getCronType', () => {
    it('should return right type', () => {
      expect(getCronType('0 0 * * 1-5')).toBe('standard');
      expect(getCronType('23 0-20/2 * * *')).toBe('standard');

      // AWS formats
      expect(getCronType('0 11-22 ? * MON-FRI *')).toBe('aws');
      expect(getCronType('0 0 ? * 1 *')).toBe('aws');

      expect(getCronType('aert')).toBe(false);
      expect(getCronType('40 *')).toBe(false);
    });
  });

  describe('getLastExecutionTimes', () => {
    it('should return next valid datetimes', () => {
      expect(getLastExecutionTimes('0 0 * * 1-5')).toHaveLength(5);
      expect(getLastExecutionTimes('23 0-20/2 * * *')).toHaveLength(5);

      // AWS formats
      expect(getLastExecutionTimes('0 11-22 ? * MON-FRI *')).toHaveLength(5);
      expect(getLastExecutionTimes('0 0 ? * 1 *')).toHaveLength(5);
    });
  });
});
