import { AES, RC4, Rabbit, TripleDES, enc } from 'crypto-js';
import { describe, expect, it } from 'vitest';

const PASSWORD = 'my secret key';
const PLAINTEXT = 'Lorem ipsum dolor sit amet';
const LEGACY_AES_FIXTURE = 'U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs';

describe('CryptoJS 4.2 compatibility boundary', () => {
  it('decrypts the existing OpenSSL-compatible AES password envelope', () => {
    expect(AES.decrypt(LEGACY_AES_FIXTURE, PASSWORD).toString(enc.Utf8)).toBe(PLAINTEXT);
  });

  it.each([
    ['AES', AES],
    ['TripleDES', TripleDES],
    ['Rabbit', Rabbit],
    ['RC4', RC4],
  ] as const)('retains the legacy %s password-envelope round trip', (_name, algorithm) => {
    const encrypted = algorithm.encrypt('Unicode compatibility: Привет 🌍', PASSWORD).toString();
    expect(algorithm.decrypt(encrypted, PASSWORD).toString(enc.Utf8)).toBe('Unicode compatibility: Привет 🌍');
  });
});
