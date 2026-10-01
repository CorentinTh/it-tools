import { type SpellingAlphabet, getSpellingAlphabet } from './text-to-nato-alphabet.constants';

export { textToSpellingAlphabet };

function getLetterPositionInAlphabet({ letter, alphabet }: { letter: string; alphabet: SpellingAlphabet }): number | undefined {
  const lower = letter.toLowerCase();
  if (alphabet.cyrillic) {
    // Russian order: а..я are contiguous at U+0430..U+044F; ё (U+0451) has no
    // word in the list and passes through
    const code = lower.codePointAt(0)!;
    return code >= 0x0430 && code <= 0x044F ? code - 0x0430 : undefined;
  }
  const index = lower.charCodeAt(0) - 'a'.charCodeAt(0);
  return index >= 0 && index < 26 ? index : undefined;
}

function textToSpellingAlphabet({ text, alphabetKey, spellDigits = true }: { text: string; alphabetKey: string; spellDigits?: boolean }) {
  const alphabet: SpellingAlphabet = getSpellingAlphabet(alphabetKey);

  return [...text]
    .map((character) => {
      const extra = alphabet.extras?.[character.toLowerCase()];
      if (extra) {
        return extra;
      }

      const position = getLetterPositionInAlphabet({ letter: character, alphabet });
      const word = position === undefined ? undefined : alphabet.letters[position];
      if (word) {
        return word;
      }

      if (spellDigits && /\d/.test(character) && alphabet.digits) {
        return alphabet.digits[Number(character)];
      }

      return character;
    })
    .join(' ');
}
