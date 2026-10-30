import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import { obfuscateJavascript } from './javascript-obfuscator.service';

describe('JavascriptObfuscator', () => {
  it('base64 encodes and wraps with atob', () => {
    const src = 'console.log(\'x\');';
    const out = obfuscateJavascript(src, 'base64');

    expect(out).toContain('atob(\'');
    const m = out.match(/atob\('(.+)'\)/);
    expect(m).toBeTruthy();
    if (m) {
      const b64 = m[1];
      const decoded = decodeURIComponent(escape(Buffer.from(b64, 'base64').toString('binary')));
      expect(decoded).toBe(src);
    }
  });

  it('rot13 encodes and includes runtime decoder', () => {
    const src = 'console.log(\'a\');';
    const out = obfuscateJavascript(src, 'rot13');

    expect(out).toContain('eval(r(s))');
    const r = src.replace(/[A-Za-z]/g, c => String.fromCharCode((c <= 'Z' ? 65 : 97) + ((c.charCodeAt(0) - (c <= 'Z' ? 65 : 97) + 13) % 26)));
    expect(out).toContain(r);
  });
});
