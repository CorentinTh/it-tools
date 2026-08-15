import { describe, expect, it } from 'vitest';
import {
  RSA_KEY_SIZES,
  RSA_WORKER_ERROR_MESSAGES,
  parseRsaTask,
  parseRsaWorkerMessage,
  parseRsaWorkerRequest,
} from './rsa-key-pair-generator.worker.protocol';

const pair = {
  bits: 2048 as const,
  publicKeyPem: '-----BEGIN PUBLIC KEY-----\nAQID\n-----END PUBLIC KEY-----\n',
  privateKeyPem: '-----BEGIN PRIVATE KEY-----\nBAUG\n-----END PRIVATE KEY-----\n',
};

describe('RSA worker protocol', () => {
  it('accepts only the three reviewed key-size presets', () => {
    expect(RSA_KEY_SIZES).toEqual([2048, 3072, 4096]);
    for (const bits of RSA_KEY_SIZES) {
      expect(parseRsaTask({ bits })).toEqual({ bits });
    }
    for (const bits of [1024, 2056, 8192, '2048']) {
      expect(() => parseRsaTask({ bits })).toThrowError(/supported RSA key size/);
    }
  });

  it('rejects extra request and task fields', () => {
    expect(() => parseRsaTask({ bits: 2048, secret: 'do not clone' })).toThrow();
    expect(() => parseRsaWorkerRequest({ jobId: 1, task: { bits: 2048 }, extra: true })).toThrow();
  });

  it('accepts exact bounded PEM results and static errors', () => {
    expect(parseRsaWorkerMessage({ jobId: 4, type: 'result', result: pair })).toEqual({
      jobId: 4,
      type: 'result',
      result: pair,
    });
    expect(parseRsaWorkerMessage({
      jobId: 4,
      type: 'error',
      code: 'generation',
      message: RSA_WORKER_ERROR_MESSAGES.generation,
    })).toMatchObject({ code: 'generation' });
  });

  it('rejects malformed, oversized, mismatched, and data-bearing worker output', () => {
    const malformed = [
      [],
      { jobId: 0, type: 'result', result: pair },
      { jobId: 1, type: 'result', result: { ...pair, bits: 1024 } },
      { jobId: 1, type: 'result', result: { ...pair, publicKeyPem: 'not pem' } },
      { jobId: 1, type: 'result', result: { ...pair, privateKeyPem: `-----BEGIN PRIVATE KEY-----\n${'A'.repeat(65)}\n-----END PRIVATE KEY-----\n` } },
      { jobId: 1, type: 'result', result: { ...pair, unexpected: 'secret' } },
      { jobId: 1, type: 'error', code: 'generation', message: 'raw internal failure' },
    ];

    for (const message of malformed) {
      expect(() => parseRsaWorkerMessage(message)).toThrowError(/invalid message/);
    }
  });
});
