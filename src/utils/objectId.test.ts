import { describe, expect, test } from 'vitest';
import { isValidObjectId, objectIdFromDate, objectIdToDate } from '@/utils/objectId';

describe('ObejctId', () => {
  describe('isValidObjectId', () => {
    test('should return true for valid Mongo ObjectIds', () => {
      expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
      expect(isValidObjectId('507f1f77bcf86cd799439012')).toBe(true);
    });

    test('should return false for invalid Mongo ObjectIds', () => {
      expect(isValidObjectId('507f1f77bcf86cd79943901')).toBe(false);
      expect(isValidObjectId('507f1f77bcf86cd79943901z')).toBe(false);
      expect(isValidObjectId('foo')).toBe(false);
      expect(isValidObjectId('')).toBe(false);
    });
  });

  describe('objectIdToDate', () => {
    test('should return Date from Mongo ObjectIds', () => {
      expect(objectIdToDate('507f1f77bcf86cd799439011')).toStrictEqual(new Date('2012-10-17T23:13:27.000+0200'));
      expect(objectIdToDate('678fd477d9bc2e855fdedfb0')).toStrictEqual(new Date('2025-01-21T18:08:07.000+0100'));
    });
  });

  describe('objectIdFromDate', () => {
    test('should return Mongo ObjectId from Date', () => {
      let objectId = objectIdFromDate(new Date('2012-10-17T23:13:27.000+0200').getTime());
      expect(isValidObjectId(objectId)).toBe(true);
      expect(objectId).toMatch(/^507f1f77/);

      objectId = objectIdFromDate(new Date('2025-01-21T18:08:07.000+0100').getTime());
      expect(isValidObjectId(objectId)).toBe(true);
      expect(objectId).toMatch(/^678fd477/);
    });

    test('should return Mongo ObjectId from Date, but only generate the date part', () => {
      let objectId = objectIdFromDate(new Date('2012-10-17T23:13:27.000+0200').getTime(), true);
      expect(isValidObjectId(objectId)).toBe(true);
      expect(objectId).toMatch(/^507f1f770000000000000000$/);

      objectId = objectIdFromDate(new Date('2025-01-21T18:08:07.000+0100').getTime(), true);
      expect(isValidObjectId(objectId)).toBe(true);
      expect(objectId).toMatch(/^678fd4770000000000000000$/);
    });
  });
});
