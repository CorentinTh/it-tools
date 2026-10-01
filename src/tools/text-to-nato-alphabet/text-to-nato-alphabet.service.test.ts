import { describe, expect, it } from 'vitest';
import { textToSpellingAlphabet } from './text-to-nato-alphabet.service';

describe('text-to-spelling-alphabet', () => {
  it('converts with the NATO alphabet by default', () => {
    expect(textToSpellingAlphabet({ text: 'AB', alphabetKey: 'nato' })).toBe('Alpha Bravo');
  });

  it('passes through unknown characters', () => {
    expect(textToSpellingAlphabet({ text: 'A!', alphabetKey: 'nato' })).toBe('Alpha !');
  });

  it('spells actual Cyrillic text with the Russian alphabet', () => {
    expect(textToSpellingAlphabet({ text: 'абв', alphabetKey: 'ru' })).toBe('Анна Борис Василий');
    expect(textToSpellingAlphabet({ text: 'Яя', alphabetKey: 'ru' })).toBe('Яков Яков');
  });

  it('maps German umlauts and eszett via extras', () => {
    expect(textToSpellingAlphabet({ text: 'äöüß', alphabetKey: 'de' })).toBe('Ärger Ökonom Übermut Eszett');
  });

  it('maps the Spanish ñ', () => {
    expect(textToSpellingAlphabet({ text: 'ñ', alphabetKey: 'es' })).toBe('Ñoño');
  });

  it('is case-insensitive', () => {
    expect(textToSpellingAlphabet({ text: 'aB', alphabetKey: 'nato' })).toBe('Alpha Bravo');
  });

  it.each([
    ['de', 'AB', 'Anton Berta'],
    ['ru', 'абв', 'Анна Борис Василий'],
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
