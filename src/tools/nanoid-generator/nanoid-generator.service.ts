import { customAlphabet, nanoid } from 'nanoid';
import { lowercase, nolookalikes, numbers, uppercase } from 'nanoid-dictionary';

const symbols = '-_';

export function createNanoid({
  length = 21,
  withLowercase = true,
  withUppercase = true,
  withNumbers = true,
  withSymbols = true,
  excludeLookalikes = false,
}: {
  length?: number
  withLowercase?: boolean
  withUppercase?: boolean
  withNumbers?: boolean
  withSymbols?: boolean
  excludeLookalikes?: boolean
}) {
  let alphabet = '';

  if (!withLowercase && !withUppercase && !withNumbers && !excludeLookalikes && !withSymbols) {
    return nanoid(length);
  }

  if (excludeLookalikes) {
    alphabet = [nolookalikes, withSymbols ? symbols : ''].join('');
  }

  alphabet = [
    withLowercase ? lowercase : '',
    withUppercase ? uppercase : '',
    withNumbers ? numbers : '',
    withSymbols ? symbols : '',
  ].join('');

  return customAlphabet(alphabet, length);
}
