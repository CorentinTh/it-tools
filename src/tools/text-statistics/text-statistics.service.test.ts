import { describe, expect, it } from 'vitest';
import { getStringSizeInBytes, textStatistics } from './text-statistics.service';

describe('text-statistics', () => {
  describe('getStringSizeInBytes', () => {
    it('should return the size of a string in bytes', () => {
      expect(getStringSizeInBytes('')).toEqual(0);
      expect(getStringSizeInBytes('a')).toEqual(1);
      expect(getStringSizeInBytes('aa')).toEqual(2);
      expect(getStringSizeInBytes('😀')).toEqual(4);
      expect(getStringSizeInBytes('aaaaaaaaaa')).toEqual(10);
    });
  });

  describe('textStatistics', () => {
    it('should return text statistics', () => {
      expect(textStatistics('a')).toEqual({
        chars: 1,
        chars_digits: 0,
        chars_lower: 1,
        chars_no_spaces: 1,
        chars_puncts: 0,
        chars_spaces: 0,
        chars_upper: 0,
        lines: 1,
        sentences: 1,
        words: 1,
        words_no_puncs: 1,
      });
      expect(textStatistics('A')).toEqual({
        chars: 1,
        chars_digits: 0,
        chars_lower: 0,
        chars_no_spaces: 1,
        chars_puncts: 0,
        chars_spaces: 0,
        chars_upper: 1,
        lines: 1,
        sentences: 1,
        words: 1,
        words_no_puncs: 1,
      });
      expect(textStatistics('a a')).toEqual({
        chars: 3,
        chars_digits: 0,
        chars_lower: 2,
        chars_no_spaces: 2,
        chars_puncts: 0,
        chars_spaces: 1,
        chars_upper: 0,
        lines: 1,
        sentences: 1,
        words: 2,
        words_no_puncs: 2,
      });
      expect(textStatistics('A a ; 1')).toEqual({
        chars: 7,
        chars_digits: 1,
        chars_lower: 1,
        chars_no_spaces: 4,
        chars_puncts: 1,
        chars_spaces: 3,
        chars_upper: 1,
        lines: 1,
        sentences: 1,
        words: 4,
        words_no_puncs: 3,
      });
      expect(textStatistics('Some sentence! Une autre phrase ? « et avec des chiffres 1234 ! »')).toEqual({
        chars: 65,
        chars_digits: 4,
        chars_lower: 41,
        chars_no_spaces: 52,
        chars_puncts: 5,
        chars_spaces: 13,
        chars_upper: 2,
        lines: 1,
        sentences: 3,
        words: 14,
        words_no_puncs: 10,
      });
      expect(textStatistics(`Some sentence! Une autre phrase ? 
      « et avec des chiffres 1234 ! »`)).toEqual({
        chars: 72,
        chars_digits: 4,
        chars_lower: 41,
        chars_no_spaces: 52,
        chars_puncts: 5,
        chars_spaces: 20,
        chars_upper: 2,
        lines: 2,
        sentences: 3,
        words: 14,
        words_no_puncs: 10,
      });
      expect(textStatistics('12 35')).toEqual({
        chars: 5,
        chars_digits: 4,
        chars_lower: 0,
        chars_no_spaces: 4,
        chars_puncts: 0,
        chars_spaces: 1,
        chars_upper: 0,
        lines: 1,
        sentences: 1,
        words: 2,
        words_no_puncs: 2,
      });
      expect(textStatistics(' 1 2 3. Other ')).toEqual({
        chars: 14,
        chars_digits: 3,
        chars_lower: 4,
        chars_no_spaces: 9,
        chars_puncts: 1,
        chars_spaces: 5,
        chars_upper: 1,
        lines: 1,
        sentences: 2,
        words: 4,
        words_no_puncs: 4,
      });
    });
  });
});
