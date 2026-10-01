import alphabetsData from './spelling-alphabets.json';

export interface SpellingAlphabet {
  key: string
  label: string
  /** 26 entries, A..Z (or 32 Cyrillic entries when cyrillic is set). */
  letters: string[]
  /** Optional digit words; missing digits pass through. */
  digits?: string[]
  /** The alphabet spells Cyrillic text: letters are indexed by Russian order. */
  cyrillic?: boolean
  /** Words for accented/special characters, keyed by lowercase character. */
  extras?: Record<string, string>
}

export { natoAlphabet, spellingAlphabets, getSpellingAlphabet };

const natoAlphabet = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliet',
  'Kilo',
  'Lima',
  'Mike',
  'November',
  'Oscar',
  'Papa',
  'Quebec',
  'Romeo',
  'Sierra',
  'Tango',
  'Uniform',
  'Victor',
  'Whiskey',
  'X-ray',
  'Yankee',
  'Zulu',
];

const spellingAlphabets = alphabetsData as SpellingAlphabet[];

function getSpellingAlphabet(key: string): SpellingAlphabet {
  const alphabet = spellingAlphabets.find(candidate => candidate.key === key);
  if (!alphabet) {
    throw new Error(`Unknown spelling alphabet: ${key}`);
  }
  return alphabet;
}
