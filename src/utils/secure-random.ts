export type RandomValuesProvider = (values: Uint32Array) => Uint32Array;

const UINT32_RANGE = 0x1_0000_0000;
const MAX_RANDOM_VALUES_PER_BATCH = 1024;

const webCryptoRandomValues: RandomValuesProvider = values => globalThis.crypto.getRandomValues(values);

export function secureRandomString({
  alphabet,
  length,
  getRandomValues = webCryptoRandomValues,
}: {
  alphabet: string
  length: number
  getRandomValues?: RandomValuesProvider
}): string {
  if (!Number.isSafeInteger(length) || length < 0) {
    throw new RangeError('Length must be a non-negative safe integer');
  }

  const characters = Array.from(alphabet);

  if (length === 0 || characters.length === 0) {
    return '';
  }

  const rejectionLimit = UINT32_RANGE - (UINT32_RANGE % characters.length);
  const result: string[] = [];

  while (result.length < length) {
    const values = new Uint32Array(Math.min(length - result.length, MAX_RANDOM_VALUES_PER_BATCH));
    getRandomValues(values);

    for (const value of values) {
      if (value < rejectionLimit) {
        result.push(characters[value % characters.length]);
      }

      if (result.length === length) {
        break;
      }
    }
  }

  return result.join('');
}
