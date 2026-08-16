import { webcrypto } from 'node:crypto';
import { Base64 } from 'js-base64';
import { beforeAll, describe, expect, it } from 'vitest';
import { verifyJwtWithPublicKey } from './jwt-asymmetric.service';

const encoder = new TextEncoder();

beforeAll(() => {
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });
});

function isKeyPair(value: CryptoKey | CryptoKeyPair): value is CryptoKeyPair {
  return 'publicKey' in value;
}

function encodeJson(value: object) {
  return Base64.fromUint8Array(encoder.encode(JSON.stringify(value)), true);
}

async function createToken(
  header: Record<string, unknown>,
  privateKey: CryptoKey,
  signingAlgorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
) {
  const signingInput = `${encodeJson(header)}.${encodeJson({ admin: true, sub: 'user-😀' })}`;
  const signature = await globalThis.crypto.subtle.sign(signingAlgorithm, privateKey, encoder.encode(signingInput));
  return `${signingInput}.${Base64.fromUint8Array(new Uint8Array(signature), true)}`;
}

function spkiToPem(spki: ArrayBuffer) {
  const body = Base64.fromUint8Array(new Uint8Array(spki)).match(/.{1,64}/gu)?.join('\n') ?? '';
  return `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`;
}

describe('asymmetric JWT verification', () => {
  it('selects one RSA JWK by kid and verifies RS256 locally', async () => {
    const generated = await globalThis.crypto.subtle.generateKey({
      hash: 'SHA-256',
      modulusLength: 2048,
      name: 'RSASSA-PKCS1-v1_5',
      publicExponent: new Uint8Array([1, 0, 1]),
    }, true, ['sign', 'verify']);
    expect(isKeyPair(generated)).toBe(true);
    if (!isKeyPair(generated)) {
      throw new Error('Expected RSA key pair.');
    }
    const publicJwk = await globalThis.crypto.subtle.exportKey('jwk', generated.publicKey);
    const token = await createToken({ alg: 'RS256', kid: 'active', typ: 'JWT' }, generated.privateKey, 'RSASSA-PKCS1-v1_5');
    const jwks = JSON.stringify({ keys: [{ ...publicJwk, alg: 'RS256', kid: 'old' }, { ...publicJwk, alg: 'RS256', kid: 'active', use: 'sig' }] });

    await expect(verifyJwtWithPublicKey({ token, publicKey: jwks })).resolves.toMatchObject({
      algorithm: 'RS256',
      keyId: 'active',
      keySource: 'jwks',
      payload: { admin: true, sub: 'user-😀' },
      verified: true,
    });
    await expect(verifyJwtWithPublicKey({ token, publicKey: JSON.stringify({ keys: [{ ...publicJwk, kid: 'other' }] }) }))
      .rejects.toThrow('No local public key matches');
  });

  it('verifies RSA-PSS from an SPKI PEM public key with the JWA salt length', async () => {
    const generated = await globalThis.crypto.subtle.generateKey({
      hash: 'SHA-256',
      modulusLength: 2048,
      name: 'RSA-PSS',
      publicExponent: new Uint8Array([1, 0, 1]),
    }, true, ['sign', 'verify']);
    if (!isKeyPair(generated)) {
      throw new Error('Expected RSA-PSS key pair.');
    }
    const token = await createToken({ alg: 'PS256' }, generated.privateKey, { name: 'RSA-PSS', saltLength: 32 });
    const pem = spkiToPem(await globalThis.crypto.subtle.exportKey('spki', generated.publicKey));

    await expect(verifyJwtWithPublicKey({ token, publicKey: pem })).resolves.toMatchObject({ keySource: 'spki', verified: true });
  });

  it('verifies the fixed-width JWS ECDSA signature format', async () => {
    const generated = await globalThis.crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    if (!isKeyPair(generated)) {
      throw new Error('Expected ECDSA key pair.');
    }
    const token = await createToken({ alg: 'ES256' }, generated.privateKey, { hash: 'SHA-256', name: 'ECDSA' });
    const publicJwk = await globalThis.crypto.subtle.exportKey('jwk', generated.publicKey);

    await expect(verifyJwtWithPublicKey({ token, publicKey: JSON.stringify(publicJwk) })).resolves.toMatchObject({
      algorithm: 'ES256',
      keySource: 'jwk',
      verified: true,
    });
  });

  it('verifies EdDSA with an Ed25519 public JWK when Web Crypto supports it', async () => {
    const generated = await globalThis.crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
    if (!isKeyPair(generated)) {
      throw new Error('Expected Ed25519 key pair.');
    }
    const token = await createToken({ alg: 'EdDSA', kid: 'ed-current' }, generated.privateKey, { name: 'Ed25519' });
    const publicJwk = await globalThis.crypto.subtle.exportKey('jwk', generated.publicKey);

    await expect(verifyJwtWithPublicKey({ token, publicKey: JSON.stringify({ ...publicJwk, alg: 'EdDSA', kid: 'ed-current' }) }))
      .resolves.toMatchObject({ algorithm: 'EdDSA', keyId: 'ed-current', verified: true });
  });

  it('rejects private material, ambiguous sets, extensions, and malformed signatures', async () => {
    const generated = await globalThis.crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    if (!isKeyPair(generated)) {
      throw new Error('Expected ECDSA key pair.');
    }
    const token = await createToken({ alg: 'ES256' }, generated.privateKey, { hash: 'SHA-256', name: 'ECDSA' });
    const publicJwk = await globalThis.crypto.subtle.exportKey('jwk', generated.publicKey);
    const privateJwk = await globalThis.crypto.subtle.exportKey('jwk', generated.privateKey);
    const criticalToken = await createToken({ alg: 'ES256', crit: ['custom'] }, generated.privateKey, { hash: 'SHA-256', name: 'ECDSA' });

    await expect(verifyJwtWithPublicKey({ token, publicKey: JSON.stringify(privateJwk) })).rejects.toThrow('Private JWK');
    await expect(verifyJwtWithPublicKey({ token, publicKey: JSON.stringify({ keys: [publicJwk, publicJwk] }) })).rejects.toThrow('more than one compatible');
    await expect(verifyJwtWithPublicKey({ token: criticalToken, publicKey: JSON.stringify(publicJwk) })).rejects.toThrow('crit extensions');
    await expect(verifyJwtWithPublicKey({ token: `${token.slice(0, token.lastIndexOf('.') + 1)}AQ`, publicKey: JSON.stringify(publicJwk) }))
      .rejects.toThrow('exactly 64 bytes');
  });
});
