import hangul from 'korean-unpacker';
import allAlphabets from './nato.alphabets.json';

type AllAlphabetsKeys = keyof typeof allAlphabets[0];

export { textToNatoAlphabet };

function isPunctuation(char: string) {
  const punctuations = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  return punctuations.includes(char);
}
function isDigit(char: string) {
  const digits = '0123456789';
  return digits.includes(char);
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function textToNatoAlphabet({
  text, langOrCountry = '(International)',
  useDigitsNames = false, usePunctuationsNames = false,
}: {
  text: string
  langOrCountry: string
  useDigitsNames?: boolean
  usePunctuationsNames?: boolean
}) {
  const getNatoWord = (searchChar: string) => {
    const alphabetLetter = allAlphabets.find(letter => letter.Letter === searchChar);
    if (alphabetLetter && alphabetLetter[langOrCountry as AllAlphabetsKeys]) {
      return alphabetLetter[langOrCountry as AllAlphabetsKeys] || '';
    }
    return null;
  };

  const charRegex = new RegExp(
    `(${
        allAlphabets
        .sort((a, b) => b.Letter.length - a.Letter.length)
        .filter(a => a[langOrCountry as AllAlphabetsKeys])
        .map(a => escapeRegExp(a.Letter))
        .join('|')
        }|.)`,
    'gi');
  return hangul.unpack(text)
    .replace(/\s+/g, ' ')
    .replace(
      charRegex,
      (character) => {
        const searchChar = character.toUpperCase();
        const isUpper = character[0].toUpperCase() === character[0];
        const natoWord = getNatoWord(searchChar);

        if (isDigit(searchChar)) {
          if (useDigitsNames) {
            return ` {digit ${searchChar} => ${natoWord}}`;
          }
          else {
            return ` (digit ${character})`;
          }
        }
        if (isPunctuation(searchChar)) {
          if (usePunctuationsNames) {
            return ` {punctuation ${searchChar} => ${natoWord}}`;
          }
          else {
            return ` (punctuation ${character})`;
          }
        }

        if (natoWord) {
          return ` ${isUpper ? natoWord.toUpperCase() : natoWord.toLowerCase()}`;
        }

        return ` (${character})`;
      })
    .trim();
}
