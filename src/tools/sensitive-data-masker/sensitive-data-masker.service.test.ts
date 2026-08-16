import { describe, expect, it } from 'vitest';
import { sanitizePlainText, sanitizeSensitiveData } from './sensitive-data-masker.service';

describe('sensitive data sanitizer', () => {
  it('redacts structured secret keys, header lists, URLs, nested JSON bodies, and optional PII', () => {
    const source = JSON.stringify({
      password: 'hunter2',
      request: {
        url: 'https://example.test/path?token=abc&safe=yes#private-fragment',
        headers: [
          { name: 'Authorization', value: 'Bearer top-secret' },
          { name: 'Accept', value: 'application/json' },
        ],
        postData: { text: JSON.stringify({ api_key: 'nested-key', email: 'ada@example.test' }) },
      },
    });
    const result = sanitizeSensitiveData({ source, mode: 'json', maskEmails: true, maskIpAddresses: false });
    const output = JSON.parse(result.output) as Record<string, unknown>;
    expect(result.detectedMode).toBe('json');
    expect(result.replacements).toBeGreaterThanOrEqual(5);
    expect(result.output).not.toContain('hunter2');
    expect(result.output).not.toContain('top-secret');
    expect(result.output).not.toContain('nested-key');
    expect(result.output).not.toContain('ada@example.test');
    expect(result.output).not.toContain('private-fragment');
    expect(output.password).toBe('[REDACTED]');
    expect(result.output).toContain('safe=yes');
    expect(result.output).toContain('application/json');
  });

  it('validates HAR shape and preserves base64 response bodies', () => {
    const source = JSON.stringify({
      log: {
        version: '1.2',
        entries: [{
          request: {
            url: 'https://example.test/?api_key=secret',
            cookies: [{ name: 'session', value: 'cookie-secret' }],
          },
          response: { content: { encoding: 'base64', text: 'cGFzc3dvcmQ9c2VjcmV0' } },
        }],
      },
    });
    const result = sanitizeSensitiveData({ source, mode: 'har', maskEmails: false, maskIpAddresses: false });
    expect(result.detectedMode).toBe('har');
    expect(result.output).not.toContain('cookie-secret');
    expect(result.output).toContain('cGFzc3dvcmQ9c2VjcmV0');
    expect(() => sanitizeSensitiveData({ source: '{}', mode: 'har', maskEmails: false, maskIpAddresses: false }))
      .toThrow(/HAR/);
  });

  it('auto-detects structured input and falls back to text', () => {
    expect(sanitizeSensitiveData({ source: '{"secret":"x"}', mode: 'auto', maskEmails: false, maskIpAddresses: false }))
      .toMatchObject({ detectedMode: 'json' });
    expect(sanitizeSensitiveData({ source: 'password=secret', mode: 'auto', maskEmails: false, maskIpAddresses: false }))
      .toMatchObject({ detectedMode: 'text', output: 'password=[REDACTED]' });
  });

  it('redacts private keys, auth headers, JWTs, email, and IPv4 while retaining surrounding text', () => {
    const input = [
      'Authorization: Bearer bearer-secret',
      'contact ada@example.test from 192.0.2.10',
      'token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signaturevalue',
      '-----BEGIN PRIVATE KEY-----\nsecret material\n-----END PRIVATE KEY-----',
    ].join('\n');
    const result = sanitizePlainText(input, true, true);
    expect(result.replacements).toBeGreaterThanOrEqual(4);
    expect(result.value).not.toContain('bearer-secret');
    expect(result.value).not.toContain('ada@example.test');
    expect(result.value).not.toContain('192.0.2.10');
    expect(result.value).not.toContain('secret material');
    expect(result.value).toContain('contact');
  });

  it('rejects empty, invalid JSON, and excessive nesting', () => {
    expect(() => sanitizeSensitiveData({ source: '', mode: 'auto', maskEmails: false, maskIpAddresses: false })).toThrow();
    expect(() => sanitizeSensitiveData({ source: '{', mode: 'json', maskEmails: false, maskIpAddresses: false })).toThrow();
    const deep = `${'{"value":'.repeat(66)}"end"${'}'.repeat(66)}`;
    expect(() => sanitizeSensitiveData({ source: deep, mode: 'json', maskEmails: false, maskIpAddresses: false }))
      .toThrow(/deeply nested/);
  });
});
