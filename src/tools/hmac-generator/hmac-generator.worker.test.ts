import { describe, expect, it } from 'vitest';
import { handleHmacRequest } from './hmac-generator.worker';

describe('HMAC worker', () => {
  it('returns a correlated RFC-vector result', () => {
    expect(handleHmacRequest({
      jobId: 9,
      task: { message: 'Hi There', key: '0b'.repeat(20), keyEncoding: 'hex', algorithm: 'SHA256', outputEncoding: 'Hex' },
    })).toMatchObject({ jobId: 9, type: 'result', result: { value: 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7' } });
  });

  it('does not echo invalid secret key input', () => {
    const response = handleHmacRequest({ jobId: 10, task: { message: 'data', key: 'private-key?', keyEncoding: 'hex', algorithm: 'SHA256', outputEncoding: 'Hex' } });
    expect(response).toMatchObject({ jobId: 10, type: 'error', code: 'processing' });
    expect(JSON.stringify(response)).not.toContain('private-key');
  });
});
