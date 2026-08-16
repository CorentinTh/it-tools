import { describe, expect, it } from 'vitest';
import { computeHmac } from './hmac-generator.service';

describe('HMAC service', () => {
  it('matches RFC 4231 test case 1 with an explicitly hex-encoded key', () => {
    expect(computeHmac({
      message: 'Hi There',
      key: '0b'.repeat(20),
      keyEncoding: 'hex',
      algorithm: 'SHA256',
      outputEncoding: 'Hex',
    })).toBe('b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7');
  });

  it('treats text, hex, and canonical Base64 as explicit byte representations', () => {
    const base = { message: 'data', algorithm: 'SHA256', outputEncoding: 'Hex' } as const;
    expect(computeHmac({ ...base, key: 'Jefe', keyEncoding: 'text' }))
      .toBe(computeHmac({ ...base, key: '4a656665', keyEncoding: 'hex' }));
    expect(computeHmac({ ...base, key: 'SmVmZQ==', keyEncoding: 'base64' }))
      .toBe(computeHmac({ ...base, key: '4a656665', keyEncoding: 'hex' }));
  });

  it('rejects ambiguous hex and non-canonical Base64', () => {
    const base = { message: '', algorithm: 'SHA256', outputEncoding: 'Hex' } as const;
    expect(() => computeHmac({ ...base, key: 'abc', keyEncoding: 'hex' })).toThrow('byte pairs');
    expect(() => computeHmac({ ...base, key: 'SmVmZQ', keyEncoding: 'base64' })).toThrow('canonical');
  });
});
