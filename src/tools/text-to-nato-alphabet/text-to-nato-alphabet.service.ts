import hangul from 'korean-unpacker';
import allAlphabets from './nato.alphabets.json';

type AllALphabetsKeys = keyof typeof allAlphabets[0];

export { textToNatoAlphabet };

function textToNatoAlphabet({ text, langOrCountry = '(International)' }: { text: string; langOrCountry: string }) {
  const charRegex = new RegExp(
    `(${
        allAlphabets
        .sort((a, b) => b.Letter.length - a.Letter.length)
        .filter(a => a[langOrCountry as AllALphabetsKeys])
        .map(a => a.Letter)
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
        const alphabetLetter = allAlphabets.find(letter => letter.Letter === searchChar);
        if (alphabetLetter && alphabetLetter[langOrCountry as AllALphabetsKeys]) {
          const natoWord = alphabetLetter[langOrCountry as AllALphabetsKeys] || '';
          return ` ${isUpper ? natoWord.toUpperCase() : natoWord.toLowerCase()}`;
        }

        return ` (${character})`;
      })
    .trim();
}
