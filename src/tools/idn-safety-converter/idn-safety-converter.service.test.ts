import { describe, expect, it } from 'vitest';
import { decodePunycode, encodePunycode, inspectIdn } from './idn-safety-converter.service';

describe('IDN safety converter', () => {
  it('encodes and decodes RFC 3492 labels', () => {
    expect(encodePunycode('bücher')).toBe('bcher-kva');
    expect(decodePunycode('bcher-kva')).toBe('bücher');
    expect(inspectIdn('münich.example')).toMatchObject({ ascii: 'xn--mnich-kva.example', unicode: 'münich.example' });
    expect(inspectIdn('xn--bcher-kva.example').unicode).toBe('bücher.example');
  });

  it('preserves a root dot and reports suspicious script mixing', () => {
    const result = inspectIdn('pаypal.example.');
    expect(result.ascii.endsWith('.')).toBe(true);
    expect(result.warnings.join(' ')).toMatch(/mixes scripts|confusable/u);
  });

  it('rejects URLs, invalid labels, and malformed punycode', () => {
    expect(() => inspectIdn('https://example.com')).toThrow(/domain name/u);
    expect(() => inspectIdn('-bad.example')).toThrow(/Invalid DNS label/u);
    expect(() => inspectIdn('xn--a.example')).toThrow();
  });
});
