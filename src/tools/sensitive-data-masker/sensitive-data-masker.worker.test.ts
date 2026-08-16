import { describe, expect, it } from 'vitest';
import { handleSanitizerWorkerRequest } from './sensitive-data-masker.worker';
import { SANITIZER_ERROR_MESSAGES } from './sensitive-data-masker.worker.protocol';

describe('sanitizer worker', () => {
  it('returns only bounded sanitized output', () => {
    const response = handleSanitizerWorkerRequest({
      jobId: 4,
      task: { source: '{"password":"do-not-echo"}', mode: 'json', maskEmails: false, maskIpAddresses: false },
    });
    expect(response).toMatchObject({ jobId: 4, type: 'result' });
    expect(JSON.stringify(response)).not.toContain('do-not-echo');
  });

  it('uses static errors without reflecting malformed content', () => {
    expect(handleSanitizerWorkerRequest({
      jobId: 5,
      task: { source: '{private-content', mode: 'json', maskEmails: false, maskIpAddresses: false },
    })).toEqual({ jobId: 5, type: 'error', code: 'processing', message: SANITIZER_ERROR_MESSAGES.processing });
  });
});
