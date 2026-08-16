import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { OtpVaultRepository, deleteOtpVaultDatabase } from './local-encrypted-otp-vault.repository';

describe('OTP vault IndexedDB repository', () => {
  it('creates, replaces, reads, clears, and deletes one versioned record', async () => {
    const factory = new IDBFactory();
    const repository = new OtpVaultRepository(factory);

    expect(await repository.read()).toBeUndefined();
    await repository.write('encrypted-v1');
    expect(await repository.read()).toBe('encrypted-v1');
    await repository.write('encrypted-v2');
    expect(await repository.read()).toBe('encrypted-v2');
    await repository.clear();
    expect(await repository.read()).toBeUndefined();
    await expect(deleteOtpVaultDatabase(factory)).resolves.toBe(true);
  });

  it('rejects oversized writes before mutating the previous record', async () => {
    const factory = new IDBFactory();
    const repository = new OtpVaultRepository(factory);
    await repository.write('previous-encrypted-record');

    await expect(repository.write('x'.repeat(2 * 1024 * 1024 + 1))).rejects.toThrow('storage limit');
    await expect(repository.read()).resolves.toBe('previous-encrypted-record');
  });
});
