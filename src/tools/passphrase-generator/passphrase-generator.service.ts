import { list as englishWordList } from '@it-tools/bip39/es/wordLists/english.wordlist';
import type { RandomValuesProvider } from '@/utils/secure-random';

export interface PassphraseOptions {
  wordCount: number
  separator: string
  capitalize: boolean
  appendNumber: boolean
  appendSymbol: boolean
}

export interface PassphraseResult {
  value: string
  entropyBits: number
  wordListSize: number
}

export const PASSPHRASE_MIN_WORDS = 4;
export const PASSPHRASE_MAX_WORDS = 12;
export const PASSPHRASE_MAX_SEPARATOR_LENGTH = 8;
export const PASSPHRASE_WORD_LIST_ID = 'BIP39 English (2048 words)';
const SYMBOLS = '!@#$%^&*+-=?';
const UINT32_RANGE = 0x1_0000_0000;
const webCryptoRandomValues: RandomValuesProvider = values => globalThis.crypto.getRandomValues(values);

function secureIndex(length: number, getRandomValues: RandomValuesProvider): number {
  const rejectionLimit = UINT32_RANGE - (UINT32_RANGE % length);
  const values = new Uint32Array(1);
  do {
    getRandomValues(values);
  } while (values[0] >= rejectionLimit);
  return values[0] % length;
}

export function validatePassphraseOptions(options: PassphraseOptions): void {
  if (!Number.isInteger(options.wordCount) || options.wordCount < PASSPHRASE_MIN_WORDS || options.wordCount > PASSPHRASE_MAX_WORDS) {
    throw new RangeError(`Word count must be between ${PASSPHRASE_MIN_WORDS} and ${PASSPHRASE_MAX_WORDS}.`);
  }
  if (Array.from(options.separator).length > PASSPHRASE_MAX_SEPARATOR_LENGTH || /[\r\n\0]/u.test(options.separator)) {
    throw new TypeError(`Separator must be at most ${PASSPHRASE_MAX_SEPARATOR_LENGTH} characters and cannot contain line breaks.`);
  }
}

export function generatePassphrase(
  options: PassphraseOptions,
  getRandomValues: RandomValuesProvider = webCryptoRandomValues,
): PassphraseResult {
  validatePassphraseOptions(options);
  const words = Array.from({ length: options.wordCount }, () => {
    const word = englishWordList.words[secureIndex(englishWordList.words.length, getRandomValues)];
    return options.capitalize ? `${word[0].toUpperCase()}${word.slice(1)}` : word;
  });
  let value = words.join(options.separator);
  let entropyBits = options.wordCount * Math.log2(englishWordList.words.length);
  if (options.appendNumber) {
    value += secureIndex(10, getRandomValues).toString();
    entropyBits += Math.log2(10);
  }
  if (options.appendSymbol) {
    value += SYMBOLS[secureIndex(SYMBOLS.length, getRandomValues)];
    entropyBits += Math.log2(SYMBOLS.length);
  }
  return { value, entropyBits, wordListSize: englishWordList.words.length };
}
