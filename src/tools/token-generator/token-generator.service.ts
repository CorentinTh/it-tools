import type { RandomValuesProvider } from '@/utils/secure-random';
import { secureRandomString } from '@/utils/secure-random';

export const TOKEN_ALPHABETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '.,;:!?/-"\'#{([|\\@)]=}*+',
} as const;

export const MAX_TOKEN_LENGTH = 512;

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
