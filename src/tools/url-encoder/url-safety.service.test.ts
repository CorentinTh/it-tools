import { describe, expect, it } from 'vitest';
import { buildTextFragmentUrl, buildUtmUrl, defangUrl, refangUrl, removeTrackingParameters } from './url-safety.service';

describe('URL safety and authoring service', () => {
  it('removes known tracking parameters without exposing their values', () => {
    const result = removeTrackingParameters('https://example.com/a?keep=1&utm_source=secret&FBCLID=token&utm_source=again#part');
    expect(result.url).toBe('https://example.com/a?keep=1#part');
    expect(result.removedParameters).toEqual(['utm_source', 'FBCLID']);
  });

  it('defangs and refangs only HTTP URL syntax', () => {
    const original = 'https://sub.example.com:8443/a.b?q=x.y#z';
    const defanged = defangUrl(original);
    expect(defanged).toBe('hxxps://sub[.]example[.]com:8443/a.b?q=x.y#z');
    expect(refangUrl(defanged)).toBe(original);
  });

  it('builds UTM URLs while preserving unrelated query parameters', () => {
    expect(buildUtmUrl('https://example.com/?keep=1', {
      source: 'newsletter',
      medium: 'email',
      campaign: 'spring launch',
      content: 'button',
    })).toBe('https://example.com/?keep=1&utm_source=newsletter&utm_medium=email&utm_campaign=spring+launch&utm_content=button');
  });

  it('builds text fragments and preserves an existing page fragment', () => {
    expect(buildTextFragmentUrl('https://example.com/article#section', {
      prefix: 'before',
      start: 'hello world',
      end: 'goodbye',
      suffix: 'after',
    })).toBe('https://example.com/article#section:~:text=before-,hello%20world,goodbye,-after');
  });

  it('rejects unsafe schemes, embedded credentials, missing fields, and oversized input', () => {
    expect(() => defangUrl('javascript:alert(1)')).toThrow('Only HTTP and HTTPS');
    expect(() => removeTrackingParameters('https://user:secret@example.com/')).toThrow('embedded credentials');
    expect(() => buildUtmUrl('https://example.com', { source: '', medium: 'email', campaign: 'x' })).toThrow('source is required');
    expect(() => refangUrl(`https://example.com/${'x'.repeat(70_000)}`)).toThrow('limited');
  });
});
