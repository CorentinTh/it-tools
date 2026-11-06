// @vitest-environment node
import { generateKeyPairSync } from 'node:crypto';
import { CompactSign } from 'jose';
import { Base64 } from 'js-base64';
import { describe, expect, it } from 'vitest';
import {
  buildShareUrl,
  decodeJwt,
  getSignatureFunctionName,
  hasUnsafeInteger,
  isSupportedAlgorithm,
  JWT_ALGORITHMS,
  readSharedJwt,
  signJwt,
  verifyJwt,
} from './jwt-parser.service';

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const SAMPLE_PAYLOAD = '{"sub":"1234567890","name":"John Doe","iat":1516239022}';

const rsaKeyPair = generateKeyPairSync('rsa', { modulusLength: 2048 });
const ecKeyPairs = {
  ES256: generateKeyPairSync('ec', { namedCurve: 'P-256' }),
  ES384: generateKeyPairSync('ec', { namedCurve: 'P-384' }),
  ES512: generateKeyPairSync('ec', { namedCurve: 'P-521' }),
};

function createKeys(keys: { secret?: string; isSecretBase64?: boolean; publicKey?: string; privateKey?: string } = {}) {
  return { secret: '', isSecretBase64: false, publicKey: '', privateKey: '', ...keys };
}

function getAsymmetricKeyPair(algorithm: string) {
  const keyPair = ecKeyPairs[algorithm as keyof typeof ecKeyPairs] ?? rsaKeyPair;

  return {
    publicKey: keyPair.publicKey.export({ type: 'spki', format: 'pem' }).toString(),
    privateKey: keyPair.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  };
}

describe('jwt-parser service', () => {
  describe('decodeJwt', () => {
    it('returns the header and the payload as formatted JSON', () => {
      expect(decodeJwt({ jwt: SAMPLE_JWT })).toEqual({
        header: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
        payload: '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',
      });
    });

    it('throws on a malformed token', () => {
      expect(() => decodeJwt({ jwt: 'garbage' })).toThrow();
    });
  });

  describe('signJwt', () => {
    it('produces the expected token for a known secret', async () => {
      const jwt = await signJwt({
        header: '{"alg":"HS256","typ":"JWT"}',
        payload: SAMPLE_PAYLOAD,
        keys: createKeys({ secret: 'your-256-bit-secret' }),
      });

      expect(jwt).toEqual(SAMPLE_JWT);
    });

    it('decodes a base64 secret before signing', async () => {
      const jwt = await signJwt({
        header: '{"alg":"HS256","typ":"JWT"}',
        payload: SAMPLE_PAYLOAD,
        keys: createKeys({ secret: 'eW91ci0yNTYtYml0LXNlY3JldA==', isSecretBase64: true }),
      });

      expect(jwt).toEqual(SAMPLE_JWT);
    });

    it.each([
      ['URL-safe', 'abc-_w', new Uint8Array([0x69, 0xB7, 0x3E, 0xFF])],
      ['unpadded', 'YWI', new TextEncoder().encode('ab')],
      ['data URL', 'data:text/plain;base64,QUJD', new TextEncoder().encode('ABC')],
    ])('decodes a %s base64 secret to the expected key bytes', async (_, secret, expectedKey) => {
      const header = '{"alg":"HS256"}';
      const jwt = await signJwt({ header, payload: '{}', keys: createKeys({ secret, isSecretBase64: true }) });
      const expectedJwt = await new CompactSign(new TextEncoder().encode('{}')).setProtectedHeader({ alg: 'HS256' }).sign(expectedKey);

      expect(jwt).toEqual(expectedJwt);
    });

    it.each(JWT_ALGORITHMS)('signs a token that verifies with %s', async (algorithm) => {
      const keys = algorithm.startsWith('HS')
        ? createKeys({ secret: 'a-secret' })
        : createKeys(getAsymmetricKeyPair(algorithm));

      const jwt = await signJwt({ header: JSON.stringify({ alg: algorithm }), payload: '{"sub":"abc"}', keys });

      expect(await verifyJwt({ jwt, keys })).toEqual('verified');
    });

    it('rejects invalid JSON with a message naming the field', async () => {
      const keys = createKeys({ secret: 'a-secret' });

      await expect(signJwt({ header: '{', payload: '{}', keys })).rejects.toThrow('The header is not valid JSON.');
      await expect(signJwt({ header: '{"alg":"HS256"}', payload: '{', keys })).rejects.toThrow('The payload is not valid JSON.');
    });

    it('rejects an unsupported algorithm', async () => {
      await expect(signJwt({ header: '{"alg":"none"}', payload: '{}', keys: createKeys() })).rejects.toThrow('The algorithm none is not supported.');
    });

    it('rejects a missing key', async () => {
      await expect(signJwt({ header: '{"alg":"HS256"}', payload: '{}', keys: createKeys() })).rejects.toThrow('Enter a secret to sign the token.');
      await expect(signJwt({ header: '{"alg":"RS256"}', payload: '{}', keys: createKeys() })).rejects.toThrow('Enter a private key to sign the token.');
    });

    it('rejects an invalid base64 secret', async () => {
      const keys = createKeys({ secret: 'not base64!', isSecretBase64: true });

      await expect(signJwt({ header: '{"alg":"HS256"}', payload: '{}', keys })).rejects.toThrow('The secret is not valid base64.');
    });

    it('rejects a malformed private key', async () => {
      const keys = createKeys({ privateKey: 'not a key' });

      await expect(signJwt({ header: '{"alg":"RS256"}', payload: '{}', keys })).rejects.toThrow('The private key is not valid for RS256.');
    });

    it('rejects a public JWK in the private key field', async () => {
      const keys = createKeys({ privateKey: JSON.stringify(rsaKeyPair.publicKey.export({ format: 'jwk' })) });

      await expect(signJwt({ header: '{"alg":"RS256"}', payload: '{}', keys })).rejects.toThrow('The private key is not valid for RS256.');
    });
  });

  describe('verifyJwt', () => {
    it('reports a matching secret as verified', async () => {
      expect(await verifyJwt({ jwt: SAMPLE_JWT, keys: createKeys({ secret: 'your-256-bit-secret' }) })).toEqual('verified');
    });

    it('reports a wrong secret as invalid', async () => {
      expect(await verifyJwt({ jwt: SAMPLE_JWT, keys: createKeys({ secret: 'wrong-secret' }) })).toEqual('invalid');
    });

    it('reports a tampered signature as invalid', async () => {
      const jwt = `${SAMPLE_JWT.slice(0, -4)}AAAA`;

      expect(await verifyJwt({ jwt, keys: createKeys({ secret: 'your-256-bit-secret' }) })).toEqual('invalid');
    });

    it('reports a malformed token as invalid', async () => {
      expect(await verifyJwt({ jwt: 'garbage', keys: createKeys({ secret: 'a-secret' }) })).toEqual('invalid');
    });

    it('reports alg none as unsupported', async () => {
      expect(await verifyJwt({ jwt: 'eyJhbGciOiJub25lIn0.e30.', keys: createKeys({ secret: 'a-secret' }) })).toEqual('unsupported-algorithm');
    });

    it('reports a missing key based on the algorithm of the token', async () => {
      const jwt = await signJwt({
        header: '{"alg":"RS256"}',
        payload: '{}',
        keys: createKeys(getAsymmetricKeyPair('RS256')),
      });

      expect(await verifyJwt({ jwt: SAMPLE_JWT, keys: createKeys() })).toEqual('missing-secret');
      expect(await verifyJwt({ jwt, keys: createKeys() })).toEqual('missing-public-key');
    });

    it('reports an invalid base64 secret', async () => {
      const keys = createKeys({ secret: 'not base64!', isSecretBase64: true });

      expect(await verifyJwt({ jwt: SAMPLE_JWT, keys })).toEqual('invalid-secret');
    });

    it.each([
      ['malformed text', 'not a key'],
      ['a private JWK', JSON.stringify(rsaKeyPair.privateKey.export({ format: 'jwk' }))],
      ['an oct JWK', JSON.stringify({ kty: 'oct', k: 'c2VjcmV0' })],
    ])('reports %s in the public key field as an invalid public key', async (_, publicKey) => {
      const jwt = await signJwt({
        header: '{"alg":"RS256"}',
        payload: '{}',
        keys: createKeys(getAsymmetricKeyPair('RS256')),
      });

      expect(await verifyJwt({ jwt, keys: createKeys({ publicKey }) })).toEqual('invalid-public-key');
    });
  });

  describe('key formats', () => {
    it('accepts PKCS#1 keys', async () => {
      const keys = createKeys({
        publicKey: rsaKeyPair.publicKey.export({ type: 'pkcs1', format: 'pem' }).toString(),
        privateKey: rsaKeyPair.privateKey.export({ type: 'pkcs1', format: 'pem' }).toString(),
      });

      const jwt = await signJwt({ header: '{"alg":"RS256"}', payload: '{}', keys });

      expect(await verifyJwt({ jwt, keys })).toEqual('verified');
    });

    it('accepts JWK keys', async () => {
      const keys = createKeys({
        publicKey: JSON.stringify(rsaKeyPair.publicKey.export({ format: 'jwk' })),
        privateKey: JSON.stringify(rsaKeyPair.privateKey.export({ format: 'jwk' })),
      });

      const jwt = await signJwt({ header: '{"alg":"RS256"}', payload: '{}', keys });

      expect(await verifyJwt({ jwt, keys })).toEqual('verified');
    });
  });

  describe('share link', () => {
    it('round-trips the token through the URL fragment', () => {
      const url = buildShareUrl({ url: 'https://example.com/jwt-parser', jwt: SAMPLE_JWT });

      expect(url).toEqual(`https://example.com/jwt-parser#token=${SAMPLE_JWT}`);
      expect(readSharedJwt({ hash: new URL(url).hash })).toEqual(SAMPLE_JWT);
    });

    it('replaces an existing fragment', () => {
      expect(buildShareUrl({ url: 'https://example.com/jwt-parser#token=old', jwt: 'new' })).toEqual('https://example.com/jwt-parser#token=new');
    });

    it('ignores an unrelated fragment', () => {
      expect(readSharedJwt({ hash: '#other' })).toBeUndefined();
    });

    it('ignores an empty token', () => {
      expect(readSharedJwt({ hash: '#token=' })).toBeUndefined();
    });
  });

  describe('hasUnsafeInteger', () => {
    function createJwt({ payload }: { payload: string }) {
      return `e30.${Base64.encodeURI(payload)}.abc`;
    }

    it('detects an unsafe integer in the raw token, where the decoded payload is already rounded', () => {
      const jwt = createJwt({ payload: '{"id":12345678901234567890}' });

      expect(hasUnsafeInteger({ jwt, payload: decodeJwt({ jwt }).payload })).toBe(true);
    });

    it('detects an unsafe integer typed in the payload', () => {
      expect(hasUnsafeInteger({ jwt: SAMPLE_JWT, payload: '{"id":-9007199254740993}' })).toBe(true);
    });

    it('accepts safe integers, digits in strings, and decimals', () => {
      expect(hasUnsafeInteger({ jwt: SAMPLE_JWT, payload: '{"id":9007199254740991}' })).toBe(false);
      expect(hasUnsafeInteger({ jwt: SAMPLE_JWT, payload: '{"id":"12345678901234567890"}' })).toBe(false);
      expect(hasUnsafeInteger({ jwt: SAMPLE_JWT, payload: '{"ratio":0.12345678901234567890}' })).toBe(false);
    });

    it('accepts a malformed token', () => {
      expect(hasUnsafeInteger({ jwt: 'garbage', payload: '{}' })).toBe(false);
    });
  });

  describe('getSignatureFunctionName', () => {
    it('names the signature function of each algorithm family', () => {
      expect(getSignatureFunctionName('HS256')).toEqual('HMACSHA256');
      expect(getSignatureFunctionName('RS384')).toEqual('RSASHA384');
      expect(getSignatureFunctionName('ES512')).toEqual('ECDSASHA512');
      expect(getSignatureFunctionName('PS256')).toEqual('RSAPSSSHA256');
    });
  });

  describe('isSupportedAlgorithm', () => {
    it('accepts listed algorithms only', () => {
      expect(isSupportedAlgorithm('HS256')).toBe(true);
      expect(isSupportedAlgorithm('none')).toBe(false);
      expect(isSupportedAlgorithm(undefined)).toBe(false);
    });
  });
});
