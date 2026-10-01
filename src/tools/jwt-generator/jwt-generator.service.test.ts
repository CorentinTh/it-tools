import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { decodeJwtParts, generateJwt } from './jwt-generator.service';

/** Independent HMAC verification through node:crypto. */
function expectedSignature(signingInput: string, secret: string): string {
  const sig = createHmac('sha256', secret).update(signingInput).digest('base64url');
  return sig;
}

describe('jwt-generator', () => {
  it('matches the canonical jwt.io example vector', async () => {
    const token = await generateJwt({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: { sub: '1234567890', name: 'John Doe', iat: 1516239022 },
      secret: 'your-256-bit-secret',
      algorithm: 'HS256',
    });

    const [header, payload, signature] = token.split('.');
    expect(header).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    expect(payload).toBe('eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ');
    // the signature from the well-known jwt.io homepage example
    expect(signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  });

  it('produces a signature node:crypto agrees with', async () => {
    const token = await generateJwt({
      header: { alg: 'HS256' },
      payload: { sub: 'test' },
      secret: 'another-secret',
      algorithm: 'HS256',
    });
    const [header, payload, signature] = token.split('.');
    expect(signature).toBe(expectedSignature(`${header}.${payload}`, 'another-secret'));
  });

  it('forces alg and typ into the header', async () => {
    const token = await generateJwt({ header: {}, payload: {}, secret: 's', algorithm: 'HS256' });
    const { header } = decodeJwtParts(token);
    expect(JSON.parse(header)).toMatchObject({ alg: 'HS256', typ: 'JWT' });
  });

  it('supports HS384 and HS512', async () => {
    for (const algorithm of ['HS384', 'HS512'] as const) {
      const token = await generateJwt({ header: {}, payload: { v: 1 }, secret: 's3', algorithm });
      const { header } = decodeJwtParts(token);
      expect(JSON.parse(header).alg).toBe(algorithm);
      expect(token.split('.')[2]!.length).toBeGreaterThan(20);
    }
  });

  it('rejects an empty secret', async () => {
    await expect(generateJwt({ header: {}, payload: {}, secret: '', algorithm: 'HS256' })).rejects.toThrow('signing secret');
  });

  it('decodes a token back into its three parts', async () => {
    const token = await generateJwt({ header: { kid: 'k1' }, payload: { sub: 'x' }, secret: 's', algorithm: 'HS256' });
    const parts = decodeJwtParts(token);
    expect(JSON.parse(parts.header).kid).toBe('k1');
    expect(JSON.parse(parts.payload).sub).toBe('x');
    expect(parts.signature.length).toBeGreaterThan(0);
  });
});
