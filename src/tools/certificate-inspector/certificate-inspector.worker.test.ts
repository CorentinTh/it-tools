import { describe, expect, it } from 'vitest';
import { handleCertificateInspectorRequest } from './certificate-inspector.worker';
import { CERTIFICATE_INSPECTOR_ERROR_MESSAGES } from './certificate-inspector.worker.protocol';

describe('certificate inspector worker', () => {
  it('uses static errors without reflecting private input', async () => {
    const response = await handleCertificateInspectorRequest({ jobId: 5, task: { source: '-----BEGIN CERTIFICATE-----\ncHJpdmF0ZQ==\n-----END CERTIFICATE-----' } });
    expect(response).toEqual({ jobId: 5, type: 'error', code: 'processing', message: CERTIFICATE_INSPECTOR_ERROR_MESSAGES.processing });
    expect(JSON.stringify(response)).not.toContain('private');
  });
});
