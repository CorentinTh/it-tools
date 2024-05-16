import { describe, expect, it } from 'vitest';
import { parseUnicodeToJavaEntities } from './unicode-characters-to-java-entities.service';

describe('unicode-to-entities', () => {
  describe('convertTextToUnicode', () => {
    it('a unicode string is converted to java entities representation', () => {
      expect(parseUnicodeToJavaEntities('là', '0')).toBe('l\u00E0');
      expect(parseUnicodeToJavaEntities('sơn tùng MTP', '0')).toBe('s\u01A1n t\u00F9ng MTP');
      expect(parseUnicodeToJavaEntities('', '0')).toBe('');
    });
  });

  describe('entities-to-unicode', () => {
    it('java entities string is converted to its unicode representation', () => {
      expect(parseUnicodeToJavaEntities('l\u00E0', '-1')).toBe('là');
      expect(parseUnicodeToJavaEntities('s\u01A1n t\u00F9ng MTP', '-1')).toBe('sơn tùng MTP');
      expect(parseUnicodeToJavaEntities('', '-1')).toBe('');
    });
  });
});
