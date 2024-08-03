import { shuffleString } from '@/utils/random';

export function createToken({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withSymbols = false,
  deniedChars = '',
  length = 64,
  alphabet,
}: {
  withUppercase?: boolean
  withLowercase?: boolean
  withNumbers?: boolean
  withSymbols?: boolean
  deniedChars?: string
  length?: number
  alphabet?: string
}) {
  const allAlphabet = (alphabet ?? (
    (withUppercase ? 'ABCDEFGHIJKLMOPQRSTUVWXYZ' : '')
    + (withLowercase ? 'abcdefghijklmopqrstuvwxyz' : '')
    + (withNumbers ? '0123456789' : '')
    + (withSymbols ? '.,;:!?./-"\'#{([-|\\@)]=}*+' : '')
  )).split('').filter(c => !(deniedChars?.includes(c))).join('');

  return shuffleString(allAlphabet.repeat(length)).substring(0, length);
}
