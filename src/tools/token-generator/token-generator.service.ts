import type { RandomValuesProvider } from '@/utils/secure-random';
import { secureRandomString } from '@/utils/secure-random';

export const TOKEN_ALPHABETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '.,;:!?/-"\'#{([|\\@)]=}*+',
} as const;

export const MAX_TOKEN_LENGTH = 512;
export const MAX_TOKEN_QUANTITY = 100;
export const MAX_TOKEN_ALPHABET_SIZE = 512;

export function createTokenAlphabet({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withSymbols = false,
  customAlphabet = '',
  deniedCharacters = '',
}: {
  withUppercase?: boolean
  withLowercase?: boolean
  withNumbers?: boolean
  withSymbols?: boolean
  customAlphabet?: string
  deniedCharacters?: string
}): string {
  const source = customAlphabet || [
    withUppercase ? TOKEN_ALPHABETS.uppercase : '',
    withLowercase ? TOKEN_ALPHABETS.lowercase : '',
    withNumbers ? TOKEN_ALPHABETS.numbers : '',
    withSymbols ? TOKEN_ALPHABETS.symbols : '',
  ].join('');
  const denied = new Set(Array.from(deniedCharacters));
  const alphabet = [...new Set(Array.from(source))].filter(character => !denied.has(character)).join('');
  if (Array.from(alphabet).length > MAX_TOKEN_ALPHABET_SIZE) {
    throw new RangeError(`Token alphabets are limited to ${MAX_TOKEN_ALPHABET_SIZE} Unicode characters.`);
  }
  return alphabet;
}

export function createToken({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withSymbols = false,
  length = 64,
  alphabet,
  getRandomValues,
}: {
  withUppercase?: boolean
  withLowercase?: boolean
  withNumbers?: boolean
  withSymbols?: boolean
  length?: number
  alphabet?: string
  getRandomValues?: RandomValuesProvider
}) {
  if (!Number.isSafeInteger(length) || length < 0 || length > MAX_TOKEN_LENGTH) {
    throw new RangeError(`Token length must be a safe integer between 0 and ${MAX_TOKEN_LENGTH}.`);
  }

  const allAlphabet = alphabet ?? [
    withUppercase ? TOKEN_ALPHABETS.uppercase : '',
    withLowercase ? TOKEN_ALPHABETS.lowercase : '',
    withNumbers ? TOKEN_ALPHABETS.numbers : '',
    withSymbols ? TOKEN_ALPHABETS.symbols : '',
  ].join('');

  return secureRandomString({ alphabet: allAlphabet, length, getRandomValues });
}

export function createTokens({
  quantity = 1,
  customAlphabet = '',
  deniedCharacters = '',
  ...options
}: Omit<Parameters<typeof createToken>[0], 'alphabet'> & {
  quantity?: number
  customAlphabet?: string
  deniedCharacters?: string
}): string[] {
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_TOKEN_QUANTITY) {
    throw new RangeError(`Token quantity must be a safe integer between 1 and ${MAX_TOKEN_QUANTITY}.`);
  }
  const alphabet = createTokenAlphabet({ ...options, customAlphabet, deniedCharacters });
  if (!alphabet) {
    throw new RangeError('Select at least one allowed character.');
  }
  return Array.from({ length: quantity }, () => createToken({ ...options, alphabet }));
}
