import { describe, expect, it } from 'vitest';
import { parseJavaEntitiesToUnicode, parseUnicodeToJavaEntities } from './unicode-characters-to-java-entities.service';

describe('unicode-to-entities', () => {
  describe('convertTextToUnicode', () => {
    it('a unicode string is converted to java entities representation', () => {
      expect(parseUnicodeToJavaEntities('là')).toBe('l\\u00E0');
      expect(parseUnicodeToJavaEntities('sơn tùng MTP')).toBe('s\\u01A1n t\\u00F9ng MTP');
      expect(parseUnicodeToJavaEntities('')).toBe('');
    });
  });

  describe('entities-to-unicode', () => {
    it('java entities string is converted to its unicode representation', () => {
      expect(parseJavaEntitiesToUnicode('l\u00E0')).toBe('là');
      expect(parseJavaEntitiesToUnicode('s\u01A1n t\u00F9ng MTP')).toBe('sơn tùng MTP');
      expect(parseJavaEntitiesToUnicode('')).toBe('');
    });
  });
});
