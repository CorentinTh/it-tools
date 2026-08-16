import { exceedsUtf8ByteLimit } from '@/utils/utf8';

export const ARGON2ID_PASSWORD_MAX_BYTES = 1024;
export const ARGON2ID_PHC_MAX_CHARACTERS = 512;
export const ARGON2ID_SALT_BYTES = 16;
export const ARGON2ID_SALT_MIN_BYTES = 8;
export const ARGON2ID_SALT_MAX_BYTES = 64;
export const ARGON2ID_MEMORY_MIN_KIB = 8;
export const ARGON2ID_MEMORY_MAX_KIB = 262_144;
export const ARGON2ID_ITERATIONS_MIN = 1;
export const ARGON2ID_ITERATIONS_MAX = 10;
export const ARGON2ID_PARALLELISM_MIN = 1;
export const ARGON2ID_PARALLELISM_MAX = 4;
export const ARGON2ID_HASH_LENGTH_MIN_BYTES = 16;
export const ARGON2ID_HASH_LENGTH_MAX_BYTES = 64;
export const ARGON2ID_RANDOM_UNAVAILABLE_MESSAGE = 'Cryptographically secure random salt generation is unavailable in this browser.';

export const ARGON2ID_DEFAULT_PARAMETERS = Object.freeze({
  memoryKiB: 65_536,
  iterations: 3,
  parallelism: 4,
  hashLength: 32,
});

export interface Argon2idParameters {
  memoryKiB: number
  iterations: number
  parallelism: number
  hashLength: number
}

export interface ParsedArgon2idPhc extends Argon2idParameters {
  phc: string
  salt: Uint8Array
  hash: Uint8Array
}

function parseBoundedInteger(value: unknown, label: string, minimum: number, maximum: number): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${label} must be a whole number between ${minimum.toLocaleString('en-US')} and ${maximum.toLocaleString('en-US')}.`);
  }
  return value;
}

export function validateArgon2idParameters(value: unknown): Argon2idParameters {
  if (!value || typeof value !== 'object') {
    throw new TypeError('Enter valid bounded Argon2id parameters.');
  }
  const record = value as Record<string, unknown>;
  const expected = ['memoryKiB', 'iterations', 'parallelism', 'hashLength'];
  if (!expected.every(key => Object.prototype.hasOwnProperty.call(record, key))) {
    throw new TypeError('Enter valid bounded Argon2id parameters.');
  }
  const parameters = {
    memoryKiB: parseBoundedInteger(record.memoryKiB, 'Memory', ARGON2ID_MEMORY_MIN_KIB, ARGON2ID_MEMORY_MAX_KIB),
    iterations: parseBoundedInteger(record.iterations, 'Iterations', ARGON2ID_ITERATIONS_MIN, ARGON2ID_ITERATIONS_MAX),
    parallelism: parseBoundedInteger(record.parallelism, 'Parallelism', ARGON2ID_PARALLELISM_MIN, ARGON2ID_PARALLELISM_MAX),
    hashLength: parseBoundedInteger(record.hashLength, 'Hash length', ARGON2ID_HASH_LENGTH_MIN_BYTES, ARGON2ID_HASH_LENGTH_MAX_BYTES),
  };
  if (parameters.memoryKiB < 8 * parameters.parallelism) {
    throw new RangeError('Memory must be at least 8 KiB per lane.');
  }
  return parameters;
}

export function validateArgon2idPassword(value: unknown): string {
  if (typeof value !== 'string' || !value || exceedsUtf8ByteLimit(value, ARGON2ID_PASSWORD_MAX_BYTES)) {
    throw new RangeError(`Password must contain 1–${ARGON2ID_PASSWORD_MAX_BYTES.toLocaleString('en-US')} UTF-8 bytes.`);
  }
  return value;
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/=+$/u, '');
}

function decodeCanonicalBase64(value: string, label: string, minimum: number, maximum: number): Uint8Array {
  if (!/^[A-Za-z0-9+/]+$/u.test(value) || value.length % 4 === 1) {
    throw new TypeError(`${label} must use canonical unpadded Base64.`);
  }
  let decoded: Uint8Array;
  try {
    const binary = atob(value.padEnd(value.length + (4 - value.length % 4) % 4, '='));
    decoded = Uint8Array.from(binary, character => character.charCodeAt(0));
  }
  catch {
    throw new TypeError(`${label} must use canonical unpadded Base64.`);
  }
  if (decoded.byteLength < minimum || decoded.byteLength > maximum || encodeBase64(decoded) !== value) {
    throw new RangeError(`${label} must decode to ${minimum}–${maximum} bytes.`);
  }
  return decoded;
}

export function createArgon2idSalt(cryptoProvider: Pick<Crypto, 'getRandomValues'> = globalThis.crypto): Uint8Array {
  if (!cryptoProvider?.getRandomValues) {
    throw new Error(ARGON2ID_RANDOM_UNAVAILABLE_MESSAGE);
  }
  return cryptoProvider.getRandomValues(new Uint8Array(ARGON2ID_SALT_BYTES));
}

export function parseArgon2idPhc(value: unknown): ParsedArgon2idPhc {
  if (typeof value !== 'string' || !value || value.length > ARGON2ID_PHC_MAX_CHARACTERS) {
    throw new RangeError(`PHC input must contain at most ${ARGON2ID_PHC_MAX_CHARACTERS} characters.`);
  }
  const match = value.match(/^\$argon2id\$v=19\$m=([1-9]\d*),t=([1-9]\d*),p=([1-9]\d*)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/u);
  if (!match) {
    throw new TypeError('Enter one canonical Argon2id v=19 PHC string with m, t, and p parameters.');
  }
  const [, memory, iterations, parallelism, saltBase64, hashBase64] = match;
  const hash = decodeCanonicalBase64(hashBase64, 'PHC hash', ARGON2ID_HASH_LENGTH_MIN_BYTES, ARGON2ID_HASH_LENGTH_MAX_BYTES);
  const parameters = validateArgon2idParameters({
    memoryKiB: Number(memory),
    iterations: Number(iterations),
    parallelism: Number(parallelism),
    hashLength: hash.byteLength,
  });
  return {
    phc: value,
    ...parameters,
    salt: decodeCanonicalBase64(saltBase64, 'PHC salt', ARGON2ID_SALT_MIN_BYTES, ARGON2ID_SALT_MAX_BYTES),
    hash,
  };
}

export function sameArgon2idParameters(left: Argon2idParameters, right: Argon2idParameters): boolean {
  return left.memoryKiB === right.memoryKiB
    && left.iterations === right.iterations
    && left.parallelism === right.parallelism
    && left.hashLength === right.hashLength;
}
