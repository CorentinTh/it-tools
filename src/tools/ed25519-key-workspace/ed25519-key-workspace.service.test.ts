import { describe, expect, it, vi } from 'vitest';
import { createOpenSshBlob, extractRawEd25519PublicKey, generateEd25519KeyPair } from './ed25519-key-workspace.service';

const publicKey = { type: 'public' } as CryptoKey;
const privateKey = { type: 'private' } as CryptoKey;
const prefix = [0x30, 0x2A, 0x30, 0x05, 0x06, 0x03, 0x2B, 0x65, 0x70, 0x03, 0x21, 0x00];

describe('Ed25519 key formatting', () => {
  it('extracts the raw key only from the exact Ed25519 SPKI envelope', () => {
    const raw = Uint8Array.from({ length: 32 }, (_, index) => index);
    expect([...extractRawEd25519PublicKey(new Uint8Array([...prefix, ...raw]))]).toEqual([...raw]);
    expect(() => extractRawEd25519PublicKey(new Uint8Array(44))).toThrow('Unexpected Ed25519 SPKI');
  });

  it('builds the RFC 4253 OpenSSH binary public-key blob', () => {
    const blob = createOpenSshBlob(new Uint8Array(32).fill(7));
    expect([...blob.slice(0, 4)]).toEqual([0, 0, 0, 11]);
    expect(new TextDecoder().decode(blob.slice(4, 15))).toBe('ssh-ed25519');
    expect([...blob.slice(15, 19)]).toEqual([0, 0, 0, 32]);
    expect(blob).toHaveLength(51);
  });

  it('exports PEM, OpenSSH, and a padding-free SHA-256 fingerprint', async () => {
    const raw = new Uint8Array(32).fill(9);
    const spki = new Uint8Array([...prefix, ...raw]);
    const generateKey = vi.fn().mockResolvedValue({ publicKey, privateKey });
    const exportKey = vi.fn(async (format: 'spki' | 'pkcs8') => (
      format === 'spki' ? spki.buffer : new Uint8Array([1, 2, 3]).buffer
    ));
    const digest = vi.fn().mockResolvedValue(new Uint8Array(32).fill(5).buffer);

    const result = await generateEd25519KeyPair('user@example.com', { generateKey, exportKey, digest });
    expect(result.publicKeyPem).toContain('-----BEGIN PUBLIC KEY-----');
    expect(result.privateKeyPem).toBe('-----BEGIN PRIVATE KEY-----\nAQID\n-----END PRIVATE KEY-----\n');
    expect(result.openSshPublicKey).toMatch(/^ssh-ed25519 [A-Za-z0-9+/]+=* user@example\.com$/);
    expect(result.fingerprint).toMatch(/^SHA256:[A-Za-z0-9+/]+$/);
    expect(result.fingerprint).not.toContain('=');
  });

  it('rejects control characters and overlong comments before key generation', async () => {
    const generateKey = vi.fn();
    await expect(generateEd25519KeyPair('bad\ncomment', { generateKey })).rejects.toMatchObject({ code: 'validation' });
    await expect(generateEd25519KeyPair('x'.repeat(129), { generateKey })).rejects.toMatchObject({ code: 'validation' });
    expect(generateKey).not.toHaveBeenCalled();
  });
});
