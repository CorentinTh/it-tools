import { describe, expect, it } from 'vitest';
import { handleHashTextWorkerRequest } from './hash-text.worker';
import { HASH_TEXT_ERROR_MESSAGES, parseHashTextDigestPayload } from './hash-text.worker.protocol';

describe('Hash Text worker', () => {
  it('hashes Unicode input with every existing algorithm', () => {
    const response = handleHashTextWorkerRequest({
      jobId: 4,
      task: { encoding: 'Hex', source: 'Привет 🌍' },
    });

    expect(response).toMatchObject({ jobId: 4, type: 'result' });
    if (response.type !== 'result') {
      throw new Error('Expected a hash result');
    }
    const digests = parseHashTextDigestPayload(response.result.value);
    expect(digests).toMatchObject({
      MD5: '81d14557f02c0358a5533e50e84cf762',
      SHA256: 'd415d2646823ba3dd5ca460a26bd0e0cc066770bbdff46c7517bf70336b01fde',
    });
  });

  it('preserves empty-input and binary-encoding semantics', () => {
    const response = handleHashTextWorkerRequest({ jobId: 2, task: { encoding: 'Bin', source: '' } });
    expect(response.type).toBe('result');
    if (response.type === 'result') {
      const digests = parseHashTextDigestPayload(response.result.value);
      expect(digests?.MD5).toHaveLength(128);
      expect(digests?.SHA512).toHaveLength(512);
    }
  });

  it('returns a static validation error without echoing malformed input', () => {
    expect(handleHashTextWorkerRequest({ jobId: 7, task: { encoding: 'Hex', source: 'secret', extra: 'secret' } }))
      .toEqual({
        jobId: 7,
        type: 'error',
        code: 'validation',
        message: HASH_TEXT_ERROR_MESSAGES.validation,
      });
  });
});
