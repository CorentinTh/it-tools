import { describe, expect, it, vi } from 'vitest';
import { createRsaAlgorithm, generateKeyPair } from './rsa-key-pair-generator.service';

const publicKey = {
  algorithm: { name: 'RSA-OAEP' },
  extractable: true,
  type: 'public',
  usages: ['encrypt'],
} as CryptoKey;
const privateKey = {
  algorithm: { name: 'RSA-OAEP' },
  extractable: true,
  type: 'private',
  usages: ['decrypt'],
} as CryptoKey;

describe('RSA Web Crypto generation', () => {
  it('uses the fixed RSA-OAEP/SHA-256/65537 algorithm contract', () => {
    const algorithm = createRsaAlgorithm(3072);

    expect(algorithm).toMatchObject({
      name: 'RSA-OAEP',
      modulusLength: 3072,
      hash: 'SHA-256',
    });
    expect([...algorithm.publicExponent]).toEqual([0x01, 0x00, 0x01]);
  });

  it('exports SPKI public and PKCS8 private keys as bounded PEM', async () => {
    const generateKey = vi.fn().mockResolvedValue({ publicKey, privateKey });
    const exportKey = vi.fn(async (format: 'spki' | 'pkcs8') => (
      format === 'spki'
        ? new Uint8Array([1, 2, 3]).buffer
        : new Uint8Array([4, 5, 6]).buffer
    ));

    await expect(generateKeyPair(2048, { generateKey, exportKey })).resolves.toEqual({
      bits: 2048,
      publicKeyPem: '-----BEGIN PUBLIC KEY-----\nAQID\n-----END PUBLIC KEY-----\n',
      privateKeyPem: '-----BEGIN PRIVATE KEY-----\nBAUG\n-----END PRIVATE KEY-----\n',
    });
    expect(generateKey).toHaveBeenCalledWith(2048);
    expect(exportKey).toHaveBeenNthCalledWith(1, 'spki', publicKey);
    expect(exportKey).toHaveBeenNthCalledWith(2, 'pkcs8', privateKey);
  });

  it.each([0, 1024, 2056, 8192])('rejects unsupported size %s before invoking Web Crypto', async (bits) => {
    const generateKey = vi.fn();

    await expect(generateKeyPair(bits, { generateKey })).rejects.toMatchObject({
      name: 'RsaTaskError',
      code: 'validation',
    });
    expect(generateKey).not.toHaveBeenCalled();
  });
});
