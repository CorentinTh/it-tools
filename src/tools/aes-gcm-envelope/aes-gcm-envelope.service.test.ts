import { webcrypto } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  AES_ENVELOPE_HEADER_BYTES,
  AES_ENVELOPE_ITERATIONS,
  type AesEnvelopeCrypto,
  decodeAesEnvelopeBase64,
  decodeUtf8TextPayload,
  decryptAesEnvelope,
  encodeAesEnvelopeBase64,
  encryptAesEnvelope,
  parseAesEnvelopeHeader,
  utf8TextPayload,
} from './aes-gcm-envelope.service';

function deterministicCrypto(): AesEnvelopeCrypto {
  let sequence = 0;
  return {
    subtle: webcrypto.subtle as unknown as AesEnvelopeCrypto['subtle'],
    randomBytes: length => Uint8Array.from({ length }, () => sequence++ & 0xFF),
  };
}

describe('versioned AES-GCM envelope', () => {
  it('round-trips Unicode text through canonical Base64 with fixed authenticated parameters', async () => {
    const plaintext = 'Private note — 😀';
    const encrypted = await encryptAesEnvelope({ kind: 'text', payload: utf8TextPayload(plaintext) }, 'correct horse battery staple', deterministicCrypto());
    const header = parseAesEnvelopeHeader(encrypted);
    expect(header).toMatchObject({ iterations: AES_ENVELOPE_ITERATIONS, ciphertextLength: encrypted.length - AES_ENVELOPE_HEADER_BYTES });
    expect(header.salt).toHaveLength(16);
    expect(header.iv).toHaveLength(12);

    const base64 = encodeAesEnvelopeBase64(encrypted);
    expect(encodeAesEnvelopeBase64(decodeAesEnvelopeBase64(base64))).toBe(base64);
    const decrypted = await decryptAesEnvelope(decodeAesEnvelopeBase64(base64), 'correct horse battery staple', deterministicCrypto());
    expect(decrypted.kind).toBe('text');
    expect(decodeUtf8TextPayload(decrypted.payload)).toBe(plaintext);
  }, 10_000);

  it('encrypts file name, media type, and bytes instead of exposing them in the header', async () => {
    const encrypted = await encryptAesEnvelope({
      kind: 'file',
      fileName: 'private-plan.txt',
      mimeType: 'text/plain',
      payload: new TextEncoder().encode('classified payload'),
    }, 'long enough passphrase', deterministicCrypto());
    const visible = new TextDecoder().decode(encrypted);
    expect(visible).not.toContain('private-plan');
    expect(visible).not.toContain('classified payload');

    const decrypted = await decryptAesEnvelope(encrypted, 'long enough passphrase', deterministicCrypto());
    expect(decrypted).toMatchObject({ kind: 'file', fileName: 'private-plan.txt', mimeType: 'text/plain' });
    expect(new TextDecoder().decode(decrypted.payload)).toBe('classified payload');
  }, 10_000);

  it('fails closed for a wrong passphrase, header mutation, or ciphertext mutation', async () => {
    const encrypted = await encryptAesEnvelope({ kind: 'text', payload: utf8TextPayload('secret') }, 'correct horse battery staple', deterministicCrypto());
    await expect(decryptAesEnvelope(encrypted, 'wrong passphrase value', deterministicCrypto())).rejects.toThrow(/Authentication failed/u);

    const headerTamper = encrypted.slice();
    headerTamper[7] = 1;
    await expect(decryptAesEnvelope(headerTamper, 'correct horse battery staple', deterministicCrypto())).rejects.toThrow(/unsupported/u);

    const ciphertextTamper = encrypted.slice();
    ciphertextTamper[ciphertextTamper.length - 1] ^= 1;
    await expect(decryptAesEnvelope(ciphertextTamper, 'correct horse battery staple', deterministicCrypto())).rejects.toThrow(/Authentication failed/u);
  }, 15_000);

  it('rejects weak passphrases, unsafe file names, malformed Base64, and abusive KDF parameters', async () => {
    await expect(encryptAesEnvelope({ kind: 'text', payload: utf8TextPayload('x') }, 'too short', deterministicCrypto())).rejects.toThrow(/12 or more/u);
    await expect(encryptAesEnvelope({ kind: 'file', fileName: '../secret', mimeType: 'text/plain', payload: new Uint8Array() }, 'long enough passphrase', deterministicCrypto())).rejects.toThrow(/File names/u);
    expect(() => decodeAesEnvelopeBase64('not base64!')).toThrow(/canonical/u);

    const malformed = new Uint8Array(AES_ENVELOPE_HEADER_BYTES + 16);
    malformed.set([0x49, 0x54, 0x41, 0x45, 1, 1, 1, 0]);
    const view = new DataView(malformed.buffer);
    view.setUint32(8, 2_000_000, false);
    view.setUint32(40, 16, false);
    expect(() => parseAesEnvelopeHeader(malformed)).toThrow(/KDF/u);
  });
});
