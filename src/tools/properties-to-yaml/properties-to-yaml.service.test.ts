import { describe, expect, it } from 'vitest';
import { isValidProperties } from './properties-to-yaml.service';

describe('isValidProperties', () => {
  it('should return true for valid properties', () => {
    const properties = 'key1=value1\nkey2=value2';
    expect(isValidProperties(properties)).toBe(true);
  });

  it('should return false for properties with duplicate keys', () => {
    const properties = 'key1=value1\nkey1=value2';
    expect(isValidProperties(properties)).toBe(false);
  });

  it('should return false for properties with incorrect format', () => {
    const properties = 'key1\nkey2=value2';
    expect(isValidProperties(properties)).toBe(false);
  });
});
