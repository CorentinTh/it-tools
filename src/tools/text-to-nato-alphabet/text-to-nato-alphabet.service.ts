import { type SpellingAlphabet, getSpellingAlphabet } from './text-to-nato-alphabet.constants';

export { textToSpellingAlphabet };

function getLetterPositionInAlphabet({ letter }: { letter: string }) {
  return letter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
}

function textToSpellingAlphabet({ text, alphabetKey, spellDigits = true }: { text: string; alphabetKey: string; spellDigits?: boolean }) {
  const alphabet: SpellingAlphabet = getSpellingAlphabet(alphabetKey);

  return [...text]
    .map((character) => {
      const alphabetIndex = getLetterPositionInAlphabet({ letter: character });
      const word = alphabet.letters[alphabetIndex];
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
