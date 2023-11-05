import { describe, expect, it } from 'vitest';
import { generateNumeronym } from './numeronym-generator.service';

describe('numeronym-generator service', () => {
  describe('generateNumeronym', () => {
    it('a numeronym of a word is the first letter, the number of letters between the first and the last letter, and the last letter', () => {
      expect(generateNumeronym('internationalization')).toBe('i18n');
      expect(generateNumeronym('accessibility')).toBe('a11y');
      expect(generateNumeronym('localization')).toBe('l10n');
    });
    it('a numeronym of a word with 3 letters is the word itself', () => {
      expect(generateNumeronym('abc')).toBe('abc');
    });
  });
});
