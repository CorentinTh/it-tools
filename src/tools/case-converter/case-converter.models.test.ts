import { camelCase, snakeCase } from 'change-case';
import { describe, expect, it } from 'vitest';
import { baseConfig } from './case-converter.models';

describe('case-converter', () => {
  it('keeps digits in the converted string', () => {
    expect(snakeCase('lorem 123 ipsum', baseConfig)).toBe('lorem_123_ipsum');
    expect(snakeCase('123 lorem', baseConfig)).toBe('123_lorem');
    expect(camelCase('lorem ipsum 42', baseConfig)).toBe('loremIpsum_42');
  });

  it('still strips non-alphanumeric separators and keeps accented letters', () => {
    expect(snakeCase('héllo, wörld!', baseConfig)).toBe('héllo_wörld');
  });
});
