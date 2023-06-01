import { describe, expect, test } from 'vitest';
import {
  isISO8601DateTimeString,
  isISO9075DateString,
  isMongoObjectId,
  isRFC3339DateString,
  isRFC7231DateString,
  isTimestamp,
  isUTCDateString,
  isUnixTimestamp,
} from './date-time-converter.models';

describe('date-time-converter models', () => {
  describe('isISO8601DateTimeString', () => {
    test('should return true for valid ISO 8601 date strings', () => {
      expect(isISO8601DateTimeString('2021-01-01T00:00:00.000Z')).toBe(true);
      expect(isISO8601DateTimeString('2023-04-12T14:56:00+01:00')).toBe(true);
      expect(isISO8601DateTimeString('20230412T145600+0100')).toBe(true);
      expect(isISO8601DateTimeString('20230412T145600Z')).toBe(true);
      expect(isISO8601DateTimeString('2016-02-01')).toBe(true);
      expect(isISO8601DateTimeString('2016')).toBe(true);
    });

    test('should return false for invalid ISO 8601 date strings', () => {
      expect(isISO8601DateTimeString()).toBe(false);
      expect(isISO8601DateTimeString('')).toBe(false);
      expect(isISO8601DateTimeString('qsdqsd')).toBe(false);
      expect(isISO8601DateTimeString('2016-02-01-')).toBe(false);
      expect(isISO8601DateTimeString('2021-01-01T00:00:00.')).toBe(false);
    });
  });

  describe('isISO9075DateString', () => {
    test('should return true for valid ISO 9075 date strings', () => {
      expect(isISO9075DateString('2022-01-01 12:00:00Z')).toBe(true);
      expect(isISO9075DateString('2022-01-01 12:00:00.123456Z')).toBe(true);
      expect(isISO9075DateString('2022-01-01 12:00:00+01:00')).toBe(true);
      expect(isISO9075DateString('2022-01-01 12:00:00-05:00')).toBe(true);
    });

    test('should return false for invalid ISO 9075 date strings', () => {
      expect(isISO9075DateString('2022/01/01T12:00:00Z')).toBe(false);
      expect(isISO9075DateString('2022-01-01 12:00:00.123456789Z')).toBe(false);
      expect(isISO9075DateString('2022-01-01 12:00:00+1:00')).toBe(false);
      expect(isISO9075DateString('2022-01-01 12:00:00-05:')).toBe(false);
      expect(isISO9075DateString('2022-01-01 12:00:00-05:00:00')).toBe(false);
      expect(isISO9075DateString('2022-01-01')).toBe(false);
      expect(isISO9075DateString('12:00:00Z')).toBe(false);
      expect(isISO9075DateString('2022-01-01T12:00:00Zfoo')).toBe(false);
    });
  });

  describe('isRFC3339DateString', () => {
    test('should return true for valid RFC 3339 date strings', () => {
      expect(isRFC3339DateString('2022-01-01T12:00:00Z')).toBe(true);
      expect(isRFC3339DateString('2022-01-01T12:00:00.123456789Z')).toBe(true);
      expect(isRFC3339DateString('2022-01-01T12:00:00.123456789+01:00')).toBe(true);
      expect(isRFC3339DateString('2022-01-01T12:00:00-05:00')).toBe(true);
    });

    test('should return false for invalid RFC 3339 date strings', () => {
      expect(isRFC3339DateString('2022/01/01T12:00:00Z')).toBe(false);
      expect(isRFC3339DateString('2022-01-01T12:00:00.123456789+1:00')).toBe(false);
      expect(isRFC3339DateString('2022-01-01T12:00:00-05:')).toBe(false);
      expect(isRFC3339DateString('2022-01-01T12:00:00-05:00:00')).toBe(false);
      expect(isRFC3339DateString('2022-01-01')).toBe(false);
      expect(isRFC3339DateString('12:00:00Z')).toBe(false);
      expect(isRFC3339DateString('2022-01-01T12:00:00Zfoo')).toBe(false);
    });
  });

  describe('isRFC7231DateString', () => {
    test('should return true for valid RFC 7231 date strings', () => {
      expect(isRFC7231DateString('Sun, 06 Nov 1994 08:49:37 GMT')).toBe(true);
      expect(isRFC7231DateString('Tue, 22 Apr 2014 07:00:00 GMT')).toBe(true);
    });

    test('should return false for invalid RFC 7231 date strings', () => {
      expect(isRFC7231DateString('06 Nov 1994 08:49:37 GMT')).toBe(false);
      expect(isRFC7231DateString('Sun, 06 Nov 94 08:49:37 GMT')).toBe(false);
      expect(isRFC7231DateString('Sun, 06 Nov 1994 8:49:37 GMT')).toBe(false);
      expect(isRFC7231DateString('Sun, 06 Nov 1994 08:49:37 GMT-0500')).toBe(false);
      expect(isRFC7231DateString('Sun, 06 November 1994 08:49:37 GMT')).toBe(false);
      expect(isRFC7231DateString('Sunday, 06 Nov 1994 08:49:37 GMT')).toBe(false);
      expect(isRFC7231DateString('06 Nov 1994')).toBe(false);
    });
  });

  describe('isUnixTimestamp', () => {
    test('should return true for valid Unix timestamps', () => {
      expect(isUnixTimestamp('1649789394')).toBe(true);
      expect(isUnixTimestamp('1234567890')).toBe(true);
      expect(isUnixTimestamp('0')).toBe(true);
    });

    test('should return false for invalid Unix timestamps', () => {
      expect(isUnixTimestamp('foo')).toBe(false);
      expect(isUnixTimestamp('')).toBe(false);
    });
  });

  describe('isTimestamp', () => {
    test('should return true for valid Unix timestamps in milliseconds', () => {
      expect(isTimestamp('1649792026123')).toBe(true);
      expect(isTimestamp('1234567890000')).toBe(true);
      expect(isTimestamp('0')).toBe(true);
    });

    test('should return false for invalid Unix timestamps in milliseconds', () => {
      expect(isTimestamp('foo')).toBe(false);
      expect(isTimestamp('')).toBe(false);
    });
  });

  describe('isUTCDateString', () => {
    test('should return true for valid UTC date strings', () => {
      expect(isUTCDateString('Sun, 06 Nov 1994 08:49:37 GMT')).toBe(true);
      expect(isUTCDateString('Tue, 22 Apr 2014 07:00:00 GMT')).toBe(true);
    });

    test('should return false for invalid UTC date strings', () => {
      expect(isUTCDateString('06 Nov 1994 08:49:37 GMT')).toBe(false);
      expect(isUTCDateString('16497920261')).toBe(false);
      expect(isUTCDateString('foo')).toBe(false);
      expect(isUTCDateString('')).toBe(false);
    });
  });

  describe('isMongoObjectId', () => {
    test('should return true for valid Mongo ObjectIds', () => {
      expect(isMongoObjectId('507f1f77bcf86cd799439011')).toBe(true);
      expect(isMongoObjectId('507f1f77bcf86cd799439012')).toBe(true);
    });

    test('should return false for invalid Mongo ObjectIds', () => {
      expect(isMongoObjectId('507f1f77bcf86cd79943901')).toBe(false);
      expect(isMongoObjectId('507f1f77bcf86cd79943901z')).toBe(false);
      expect(isMongoObjectId('foo')).toBe(false);
      expect(isMongoObjectId('')).toBe(false);
    });
  });
});
