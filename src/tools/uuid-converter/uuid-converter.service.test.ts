import { describe, expect, it } from 'vitest';
import { UUID2HEX, getVersion, normalizeUUID } from './uuid-converter.service';

const validUuid = '005056a3-e753-1eee-97a1-e5eb141bb52c';
const validUuidHex = '005056A3E7531EEE97A1E5EB141BB52C';
const inValidUuid = '005056a3-e753-1eee-97a1-e5eb141bb52x';

describe('uuid-converter', () => {
  describe('normalizeUUID', () => {
    it('A valid UUID should be returned without changes', () => {
      expect(normalizeUUID(validUuid)).toBe(validUuid);
    });
    it('An invalid UUID should return an empty string', () => {
      expect(normalizeUUID(inValidUuid)).toBe('');
    });
    it('A packed UUID in hex format should return its valid UUID', () => {
      expect(normalizeUUID(validUuidHex)).toBe(validUuid);
    });
  });

  describe('UUID2HEX', () => {
    it('A UUID is converted to upper case hex notation', () => {
      expect(UUID2HEX(validUuid)).toBe(validUuidHex.toUpperCase());
    });
    it('A UUID is converted to lower case hex notation', () => {
      expect(UUID2HEX(validUuid, false)).toBe(validUuidHex.toLowerCase());
    });
    it('An invalid UUID should return an empty string', () => {
      expect(UUID2HEX(inValidUuid)).toBe('');
    });
  });

  describe('getVersion', () => {
    it('Returns the RFC version of the UUID as string', () => {
      expect(getVersion(validUuid)).toBe('1');
    });
  });
  it('An invalid UUID should return an empty string', () => {
    expect(getVersion(inValidUuid)).toBe('');
  });
});
