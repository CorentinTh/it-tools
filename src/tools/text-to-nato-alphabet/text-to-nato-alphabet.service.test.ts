import { describe, expect, it } from 'vitest';
import { textToSpellingAlphabet } from './text-to-nato-alphabet.service';

describe('text-to-spelling-alphabet', () => {
  it('converts with the NATO alphabet by default', () => {
    expect(textToSpellingAlphabet({ text: 'AB', alphabetKey: 'nato' })).toBe('Alpha Bravo');
  });

  it('passes through unknown characters', () => {
    expect(textToSpellingAlphabet({ text: 'A!', alphabetKey: 'nato' })).toBe('Alpha !');
  });

  it('is case-insensitive', () => {
    expect(textToSpellingAlphabet({ text: 'aB', alphabetKey: 'nato' })).toBe('Alpha Bravo');
  });

  it.each([
    ['de', 'AB', 'Anton Berta'],
    ['ru', 'AB', 'Анна Борис'],
  ])('converts with the %s alphabet', (key, input, expected) => {
    expect(textToSpellingAlphabet({ text: input, alphabetKey: key })).toBe(expected);
  });

  it.each([
    ['1A', true, 'Eins Anton'],
    ['1A', false, '1 Anton'],
  ])('digits in German with spellDigits=%s', (input, spellDigits, expected) => {
    expect(textToSpellingAlphabet({ text: input, alphabetKey: 'de', spellDigits })).toBe(expected);
  });
});
