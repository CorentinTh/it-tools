import { describe, expect, it, vi } from 'vitest';
import { handleRsaWorkerRequest } from './rsa-key-pair-generator.worker-handler';
import { RSA_WORKER_ERROR_MESSAGES } from './rsa-key-pair-generator.worker.protocol';

const pair = {
  bits: 2048 as const,
  publicKeyPem: '-----BEGIN PUBLIC KEY-----\nAQID\n-----END PUBLIC KEY-----\n',
  privateKeyPem: '-----BEGIN PRIVATE KEY-----\nBAUG\n-----END PRIVATE KEY-----\n',
};

describe('RSA worker handler', () => {
  it('generates only after a valid explicit worker request', async () => {
    const generator = vi.fn().mockResolvedValue(pair);

    await expect(handleRsaWorkerRequest({ jobId: 7, task: { bits: 2048 } }, generator)).resolves.toEqual({
      jobId: 7,
      type: 'result',
      result: pair,
    });
    expect(generator).toHaveBeenCalledOnce();
    expect(generator).toHaveBeenCalledWith(2048);
  });

  it('rejects invalid requests without starting generation', async () => {
    const generator = vi.fn();

    await expect(handleRsaWorkerRequest({ jobId: 7, task: { bits: 2056 } }, generator)).resolves.toEqual({
      jobId: 7,
      type: 'error',
      code: 'validation',
      message: RSA_WORKER_ERROR_MESSAGES.validation,
    });
    expect(generator).not.toHaveBeenCalled();
  });

  it('never exposes raw Web Crypto failures', async () => {
    const generator = vi.fn().mockRejectedValue(new Error('private browser detail'));
    const result = await handleRsaWorkerRequest({ jobId: 9, task: { bits: 4096 } }, generator);

    expect(result).toEqual({
      jobId: 9,
      type: 'error',
      code: 'generation',
      message: RSA_WORKER_ERROR_MESSAGES.generation,
    });
    expect(JSON.stringify(result)).not.toContain('private browser detail');
  });
});
