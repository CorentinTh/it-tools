import { webcrypto } from 'node:crypto';
import { beforeAll, describe, expect, it } from 'vitest';
import { describeTemporalClaims, parseJwtCompact, signJwt, verifyJwt } from './jwt-parser.service';

beforeAll(() => {
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });
});

describe('JWT workspace service', () => {
  it('round-trips and verifies bounded Unicode HS256 tokens', async () => {
    const secret = '0123456789abcdef0123456789abcdef';
    const token = await signJwt({ headerJson: '{}', payloadJson: '{"sub":"user-😀","admin":true}', algorithm: 'HS256', secret });
    const result = await verifyJwt({ token, secret });
    expect(result.verified).toBe(true);
    expect(result.payload).toEqual({ sub: 'user-😀', admin: true });
    await expect(verifyJwt({ token: `${token.slice(0, -1)}A`, secret })).resolves.toMatchObject({ verified: false });
  });

  it('keeps unsigned authoring visibly unverified', async () => {
    const token = await signJwt({ headerJson: '{"kid":"demo"}', payloadJson: '{"sub":"123"}', algorithm: 'none', secret: '' });
    expect(token.endsWith('.')).toBe(true);
    await expect(verifyJwt({ token, secret: '' })).resolves.toMatchObject({ unsigned: true, verified: false });
  });

  it('rejects weak secrets, unsupported algorithms, malformed JSON, and oversized tokens', async () => {
    await expect(signJwt({ headerJson: '{}', payloadJson: '{}', algorithm: 'HS256', secret: 'short' })).rejects.toThrow('32–1,024');
    await expect(signJwt({ headerJson: '[]', payloadJson: '{}', algorithm: 'none', secret: '' })).rejects.toThrow('JSON object');
    expect(() => parseJwtCompact(`${'a'.repeat(262_145)}.e30.`)).toThrow('exceeds');
    const unsupported = 'eyJhbGciOiJSUzI1NiJ9.e30.signature';
    await expect(verifyJwt({ token: unsupported, secret: 'x'.repeat(64) })).rejects.toThrow('Only none');
  });

  it('reports temporal warnings without claiming authorization validation', () => {
    expect(describeTemporalClaims({ exp: 99, nbf: 101, iat: 'today' }, 100)).toEqual([
      'iat is present but is not a finite NumericDate.',
      'Token is not active yet according to nbf and this browser clock.',
      'Token is expired according to exp and this browser clock.',
    ]);
  });
});
