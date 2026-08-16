import { describe, expect, it } from 'vitest';
import { handleSamlInspectionRequest } from './saml-enterprise-inspector.worker';

describe('SAML inspector worker', () => {
  it('returns a bounded decode-only report', async () => {
    const source = btoa('<Response ID="_secret" Version="2.0"></Response>');
    const message = await handleSamlInspectionRequest({ jobId: 8, task: { source, binding: 'base64' } });
    expect(message.type).toBe('result');
    if (message.type !== 'result') {
      throw new Error('Expected result');
    }
    expect(message.result.value).toContain('Signature verification: NOT PERFORMED');
  });

  it('uses a static malformed-request error without echoing input', async () => {
    const message = await handleSamlInspectionRequest({ jobId: 9, task: { source: 'secret-value', binding: 'invalid' } });
    expect(message).toEqual({ jobId: 9, type: 'error', code: 'validation', message: 'Enter a bounded SAML message and select a supported binding.' });
    expect(JSON.stringify(message)).not.toContain('secret-value');
  });
});
