import { webcrypto } from 'node:crypto';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  createOtpVaultEntry,
  decryptOtpVault,
  encryptOtpVault,
  validateOtpVaultEntry,
} from './local-encrypted-otp-vault.service';

beforeAll(() => {
  vi.stubGlobal('crypto', webcrypto);
});

describe('encrypted OTP vault service', () => {
  it('round-trips authenticated entries without exposing plaintext in the envelope', async () => {
    const entry = createOtpVaultEntry({
      digits: 6,
      issuer: 'Example',
      label: 'alice@example.com',
      period: 30,
      secret: 'JBSWY3DPEHPK3PXP',
    });
    const envelope = await encryptOtpVault([entry], 'correct horse battery staple');

    expect(envelope).not.toContain(entry.secret);
    await expect(decryptOtpVault(envelope, 'correct horse battery staple')).resolves.toEqual([entry]);
    await expect(decryptOtpVault(envelope, 'incorrect horse battery staple')).rejects.toThrow('Authentication failed');
  });

  it('rejects malformed secrets, unsupported periods, and extra fields', () => {
    expect(() => validateOtpVaultEntry({
      createdAt: new Date().toISOString(),
      digits: 6,
      id: 'valid-id',
      issuer: 'Example',
      label: 'Alice',
      period: 30,
      secret: 'NOT-BASE32',
    })).toThrow('Base32');
    expect(() => validateOtpVaultEntry({
      createdAt: new Date().toISOString(),
      digits: 6,
      id: 'valid-id',
      issuer: 'Example',
      label: 'Alice',
      period: 10,
      secret: 'JBSWY3DPEHPK3PXP',
    })).toThrow('15 to 300');
  });
});
