import { webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { inspectPemWorkspace, inspectPkcs12 } from './pkcs12-pem-workspace.service';

beforeAll(() => {
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });
});

const publicKey = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
-----END PUBLIC KEY-----`;

describe('PKCS#12 / PEM workspace', () => {
  it('normalizes and inventories supported public PEM blocks', async () => {
    const report = JSON.parse(await inspectPemWorkspace(`\n${publicKey}\n`));
    expect(report).toMatchObject({ blockCount: 1, format: 'PEM workspace', privateMaterialExported: false });
    expect(report.normalizedPemBundle).toBe(publicKey);
    expect(report.blocks[0]).toMatchObject({ label: 'PUBLIC KEY', publicKeyAlgorithm: 'Ed25519' });
  });

  it('rejects private PEM material and malformed PFX data', async () => {
    await expect(inspectPemWorkspace('-----BEGIN PRIVATE KEY-----\nAQID\n-----END PRIVATE KEY-----')).rejects.toThrow('not accepted');
    await expect(inspectPkcs12(new Uint8Array([1, 2, 3]), 'password')).rejects.toThrow('structure, integrity, or password');
  });

  it('checks integrity and exports only certificates from a modern PFX fixture', async () => {
    const fixture = readFileSync(new URL('./fixtures/modern-pfx.base64', import.meta.url), 'utf8').trim();
    const bytes = Uint8Array.from(atob(fixture), character => character.charCodeAt(0));
    const report = JSON.parse(await inspectPkcs12(bytes, 'testpass'));
    expect(report).toMatchObject({ certificateCount: 1, format: 'PKCS#12', integrityChecked: true, privateKeyBagCount: 1, privateMaterialExported: false });
    expect(report.certificatePemBundle).toContain('-----BEGIN CERTIFICATE-----');
    await expect(inspectPkcs12(bytes, 'wrong')).rejects.toThrow('integrity, or password');
  });
});
