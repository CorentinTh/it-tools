import { sample as sampleImpl, times } from 'lodash-es';

export function createToken({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withSymbols = false,
  length = 64,
  alphabet,
  exclude,
  sample = sampleImpl,
}: {
  withUppercase?: boolean;
  withLowercase?: boolean;
  withNumbers?: boolean;
  withSymbols?: boolean;
  length?: number;
  alphabet?: string;
  exclude?: string | string[];
  sample?: (str: string) => string;
}) {
  const allAlphabet = alphabet ?? [
    withUppercase ? 'ABCDEFGHIJKLMOPQRSTUVWXYZ' : '',
    withLowercase ? 'abcdefghijklmopqrstuvwxyz' : '',
    withNumbers ? '0123456789' : '',
    withSymbols ? '.,;:!?./-"\'#{([-|\\@)]=}*+' : '',
  ].join('');

  const charsToExclude = exclude ? (Array.isArray(exclude) ? exclude.join('') : exclude) : '';
  const filteredAlphabet = allAlphabet.split('').filter(char => !charsToExclude.includes(char)).join('');

  return times(length, () => sample(filteredAlphabet)).join('');
}
