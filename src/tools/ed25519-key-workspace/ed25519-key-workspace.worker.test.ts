import { describe, expect, it, vi } from 'vitest';
import { handleEd25519WorkerRequest } from './ed25519-key-workspace.worker-handler';

const pair = {
  publicKeyPem: '-----BEGIN PUBLIC KEY-----\nAQID\n-----END PUBLIC KEY-----\n',
  privateKeyPem: '-----BEGIN PRIVATE KEY-----\nBAUG\n-----END PRIVATE KEY-----\n',
  openSshPublicKey: 'ssh-ed25519 AAAA',
  fingerprint: 'SHA256:AAAA',
};

describe('Ed25519 worker boundary', () => {
  it('returns generated output for an exact bounded task', async () => {
    const generator = vi.fn().mockResolvedValue(pair);
    await expect(handleEd25519WorkerRequest({ jobId: 7, task: { comment: 'dev' } }, generator))
      .resolves.toEqual({ jobId: 7, type: 'result', result: pair });
    expect(generator).toHaveBeenCalledWith('dev');
  });

  it('fails closed for malformed input and unsupported Web Crypto', async () => {
    const generator = vi.fn().mockRejectedValue(new DOMException('unsupported', 'NotSupportedError'));
    await expect(handleEd25519WorkerRequest({ jobId: 2, task: { comment: '', extra: true } }, generator))
      .resolves.toMatchObject({ type: 'error', code: 'validation' });
    await expect(handleEd25519WorkerRequest({ jobId: 2, task: { comment: '' } }, generator))
      .resolves.toMatchObject({ type: 'error', code: 'unavailable' });
  });
});
