import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleAesEnvelopeRequest } from './aes-gcm-envelope.worker-handler';
import { parseAesEnvelopeMessage, parseAesEnvelopeTask } from './aes-gcm-envelope.worker.protocol';

beforeEach(() => {
  vi.stubGlobal('crypto', webcrypto);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AES-GCM envelope worker', () => {
  it('round-trips a bounded text task without exposing the passphrase in messages', async () => {
    const encrypted = await handleAesEnvelopeRequest({ jobId: 4, task: { operation: 'encrypt-text', passphrase: 'correct horse battery staple', text: 'private 😀' } });
    expect(encrypted.type).toBe('result');
    if (encrypted.type !== 'result' || encrypted.result.kind !== 'encrypted-text') {
      throw new Error('Expected encrypted text.');
    }
    expect(JSON.stringify(encrypted)).not.toContain('correct horse battery staple');
    parseAesEnvelopeMessage(encrypted);

    const decrypted = await handleAesEnvelopeRequest({ jobId: 5, task: { operation: 'decrypt-text', passphrase: 'correct horse battery staple', base64: encrypted.result.base64 } });
    expect(decrypted).toMatchObject({ jobId: 5, type: 'result', result: { kind: 'decrypted-text', text: 'private 😀' } });
    parseAesEnvelopeMessage(decrypted);
  }, 10_000);

  it('returns one static authentication error and does not echo the secret', async () => {
    const encrypted = await handleAesEnvelopeRequest({ jobId: 6, task: { operation: 'encrypt-text', passphrase: 'correct horse battery staple', text: 'top-secret-value' } });
    if (encrypted.type !== 'result' || encrypted.result.kind !== 'encrypted-text') {
      throw new Error('Expected encrypted text.');
    }
    const failed = await handleAesEnvelopeRequest({ jobId: 7, task: { operation: 'decrypt-text', passphrase: 'different long passphrase', base64: encrypted.result.base64 } });
    expect(failed).toEqual({ jobId: 7, type: 'error', code: 'authentication', message: 'Authentication failed: the passphrase is wrong or the envelope was modified.' });
    expect(JSON.stringify(failed)).not.toContain('top-secret-value');
  }, 10_000);

  it('rejects extra task keys and inconsistent worker results', () => {
    expect(() => parseAesEnvelopeTask({ operation: 'encrypt-text', passphrase: 'correct horse battery staple', text: 'x', extra: true })).toThrow(/supported/u);
    expect(() => parseAesEnvelopeMessage({ jobId: 1, type: 'result', result: { kind: 'encrypted-file', inputBytes: 2, outputBytes: 3, output: new ArrayBuffer(2) } })).toThrow(/invalid message/u);
  });
});
