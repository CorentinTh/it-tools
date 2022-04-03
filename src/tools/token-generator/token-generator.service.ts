import { shuffleString } from '@/utils/random';

export function createToken({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withSymbols = false,
  length = 64,
}: {
  withUppercase?: boolean;
  withLowercase?: boolean;
  withNumbers?: boolean;
  withSymbols?: boolean;
  length?: number;
}) {
  const alphabet = [
    ...(withUppercase ? 'ABCDEFGHIJKLMOPQRSTUVWXYZ' : ''),
    ...(withLowercase ? 'abcdefghijklmopqrstuvwxyz' : ''),
    ...(withNumbers ? '0123456789' : ''),
    ...(withSymbols ? '.,;:!?./-"\'#{([-|\\@)]=}*+' : ''),
  ].join('');

  return shuffleString(alphabet.repeat(length)).substring(0, length);
}
