import { describe, expect, it } from 'vitest';
import { handlePkcs12PemWorkerRequest } from './pkcs12-pem-workspace.worker';

describe('PKCS#12 / PEM worker boundary', () => {
  it('returns only bounded generic errors for malformed private input', async () => {
    await expect(handlePkcs12PemWorkerRequest({ jobId: 2, task: { kind: 'pem', source: 'private' } }))
      .resolves.toEqual({
        jobId: 2,
        type: 'error',
        code: 'processing',
        message: 'PKCS#12 / PEM processing failed. Check the format, password, algorithms, and documented limits.',
      });
    await expect(handlePkcs12PemWorkerRequest({ jobId: 3, task: { kind: 'pkcs12', file: new File(['x'], 'a.p12'), password: 'пароль' } }))
      .resolves.toMatchObject({ jobId: 3, type: 'error', code: 'validation' });
  });
});
