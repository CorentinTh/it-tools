import { describe, expect, it } from 'vitest';
import { dateFromObjectId, generateMongoFilter, objectIdFromDate, objectIdSyntaxFromDate } from './mongo-objectid-converter.service';

describe('mongo-objectid-converter', () => {
  describe('objectIdFromDate', () => {
    it('convert a Date to ObjectId', () => {
      expect(objectIdFromDate(new Date(Date.UTC(2024, 0, 1)))).to.eql('659200800000000000000000');
      expect(objectIdFromDate(new Date(Date.UTC(2024, 0, 1, 12, 12, 12)))).to.eql('6592ac1c0000000000000000');
    });
  });
  describe('objectIdSyntaxFromDate', () => {
    it('convert a Date to ObjectId', () => {
      expect(objectIdSyntaxFromDate(new Date(Date.UTC(2024, 0, 1)))).to.eql('ObjectId("659200800000000000000000")');
    });
  });
  describe('dateFromObjectId', () => {
    it('convert an ObjectId to Date', () => {
      expect(dateFromObjectId('659200800000000000000000')).to.eql(new Date(Date.UTC(2024, 0, 1)));
      expect(dateFromObjectId('6592ac1c0000000000000000')).to.eql(new Date(Date.UTC(2024, 0, 1, 12, 12, 12)));
    });
  });
  describe('generateMongoFilter', () => {
    it('convert a date to mongo query', () => {
      expect(generateMongoFilter({
        date: new Date(Date.UTC(2024, 0, 1, 12, 12, 12)),
        tableName: 'comments',
      })).to.eql('db.comments.find({_id: {$gt: ObjectId("6592ac1c0000000000000000")}})');
    });
  });
});
