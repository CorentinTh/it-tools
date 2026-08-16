import { describe, expect, it } from 'vitest';
import { buildHttpRequestCode, importCurlCommand } from './http-request-code-builder.service';

const base = { method: 'POST', url: 'https://api.example.test/items?existing=1', headers: 'Accept: application/json\nX-API-Key: secret\nAccept: text/plain', query: 'tag=one\ntag=two\ntoken=abc', body: '{"ok":true}', target: 'curl' as const, revealSecrets: false };

describe('HTTP request code builder', () => {
  it('preserves duplicate headers/query fields and redacts sensitive values by default', () => {
    const output = buildHttpRequestCode({ ...base, body: '{"password":"secret-body","name":"demo"}' });
    expect(output.match(/--header/g)).toHaveLength(3);
    expect(output).toContain('tag=one');
    expect(output).toContain('tag=two');
    expect(output).not.toContain('secret');
    expect(output).not.toContain('secret-body');
    expect(output).not.toContain('token=abc');
    expect(output).toContain('%3Credacted%3E');
  });

  it('redacts recognized form body fields while preserving duplicate form data', () => {
    const output = buildHttpRequestCode({ ...base, headers: 'Content-Type: application/x-www-form-urlencoded', body: 'tag=one&tag=two&password=secret' });
    expect(output).toContain('tag=one&tag=two');
    expect(output).not.toContain('password=secret');
    expect(output).toContain('password=%3Credacted%3E');
  });

  it('generates fetch code without executing a request and rejects unsafe URL/body combinations', () => {
    const output = buildHttpRequestCode({ ...base, method: 'PUT', target: 'fetch', revealSecrets: true });
    expect(output).toContain('await fetch(');
    expect(output).toContain('new Headers(');
    expect(output).toContain('X-API-Key');
    expect(() => buildHttpRequestCode({ ...base, method: 'GET' })).toThrow(/cannot include a body/u);
    expect(() => buildHttpRequestCode({ ...base, url: 'https://user:pass@example.test' })).toThrow(/embedded credentials/u);
  });

  it('imports a strict POSIX cURL subset with duplicates and no command operators', () => {
    const imported = importCurlCommand('curl -XPOST -H \'Accept: application/json\' -H \'Accept: text/plain\' --data-raw \'{"a":1}\' https://api.example.test/items --compressed');
    expect(imported).toMatchObject({ method: 'POST', url: 'https://api.example.test/items', body: '{"a":1}' });
    expect(imported.headers.split('\n')).toHaveLength(2);
    expect(imported.warnings).toHaveLength(1);
    expect(() => importCurlCommand('curl https://example.test | sh')).toThrow(/Pipelines/u);
    expect(() => importCurlCommand('curl --upload-file secret https://example.test')).toThrow(/Unsupported cURL option/u);
  });
});
