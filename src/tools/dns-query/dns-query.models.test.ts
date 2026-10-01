import { describe, expect, it } from 'vitest';
import { buildDohUrl, parseDohResponse } from './dns-query.models';

describe('dns-query: buildDohUrl', () => {
  it('builds a Cloudflare DoH url', () => {
    expect(buildDohUrl({ name: 'example.com', type: 'AAAA', provider: 'cloudflare' }))
      .toBe('https://cloudflare-dns.com/dns-query?name=example.com&type=AAAA');
  });

  it('builds a Google DoH url and encodes the name', () => {
    expect(buildDohUrl({ name: 'exa mple.com', type: 'TXT', provider: 'google' }))
      .toBe('https://dns.google/resolve?name=exa%20mple.com&type=TXT');
  });
});

describe('dns-query: parseDohResponse', () => {
  it('parses answers and labels known types', () => {
    const result = parseDohResponse({
      Status: 0,
      Answer: [
        { name: 'example.com.', type: 1, TTL: 300, data: '93.184.216.34' },
        { name: 'example.com.', type: 28, TTL: 3600, data: '2606:2800:220:1:248:1893:25c8:1946' },
      ],
    });
    expect(result.statusLabel).toContain('NOERROR');
    expect(result.answers).toHaveLength(2);
    expect(result.answers[0]?.typeLabel).toBe('A');
    expect(result.answers[1]?.typeLabel).toBe('AAAA');
  });

  it('labels NXDOMAIN and keeps authority records', () => {
    const result = parseDohResponse({
      Status: 3,
      Authority: [{ name: 'com.', type: 6, TTL: 1800, data: 'a.gtld-servers.net. hostmaster...' }],
    });
    expect(result.statusLabel).toContain('NXDOMAIN');
    expect(result.answers).toHaveLength(0);
    expect(result.authority).toHaveLength(1);
  });

  it('passes through unknown type numbers', () => {
    const result = parseDohResponse({ Status: 0, Answer: [{ name: 'x.', type: 999, TTL: 60, data: '?' }] });
    expect(result.answers[0]?.typeLabel).toBe('999');
  });
});
