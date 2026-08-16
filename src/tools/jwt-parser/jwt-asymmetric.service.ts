import { Base64 } from 'js-base64';
import { type JsonRecord, parseJwtCompact } from './jwt-parser.service';

export type JwtAsymmetricAlgorithm =
  | 'RS256' | 'RS384' | 'RS512'
  | 'PS256' | 'PS384' | 'PS512'
  | 'ES256' | 'ES384' | 'ES512'
  | 'EdDSA';

type JwkRecord = JsonWebKey & Record<string, unknown>;

export interface JwtAsymmetricVerificationResult {
  algorithm: JwtAsymmetricAlgorithm
  header: JsonRecord
  keyId?: string
  keySource: 'jwk' | 'jwks' | 'spki'
  payload: JsonRecord
  verified: boolean
}

export const JWT_MAX_PUBLIC_KEY_BYTES = 256 * 1024;
export const JWT_MAX_JWKS_KEYS = 64;
const JWT_MAX_KEY_NODES = 2_000;
const encoder = new TextEncoder();

const algorithmProfiles = {
  RS256: { hash: 'SHA-256', importName: 'RSASSA-PKCS1-v1_5', kty: 'RSA', verifyName: 'RSASSA-PKCS1-v1_5' },
  RS384: { hash: 'SHA-384', importName: 'RSASSA-PKCS1-v1_5', kty: 'RSA', verifyName: 'RSASSA-PKCS1-v1_5' },
  RS512: { hash: 'SHA-512', importName: 'RSASSA-PKCS1-v1_5', kty: 'RSA', verifyName: 'RSASSA-PKCS1-v1_5' },
  PS256: { hash: 'SHA-256', importName: 'RSA-PSS', kty: 'RSA', saltLength: 32, verifyName: 'RSA-PSS' },
  PS384: { hash: 'SHA-384', importName: 'RSA-PSS', kty: 'RSA', saltLength: 48, verifyName: 'RSA-PSS' },
  PS512: { hash: 'SHA-512', importName: 'RSA-PSS', kty: 'RSA', saltLength: 64, verifyName: 'RSA-PSS' },
  ES256: { curve: 'P-256', hash: 'SHA-256', importName: 'ECDSA', kty: 'EC', signatureBytes: 64, verifyName: 'ECDSA' },
  ES384: { curve: 'P-384', hash: 'SHA-384', importName: 'ECDSA', kty: 'EC', signatureBytes: 96, verifyName: 'ECDSA' },
  ES512: { curve: 'P-521', hash: 'SHA-512', importName: 'ECDSA', kty: 'EC', signatureBytes: 132, verifyName: 'ECDSA' },
  EdDSA: { curve: 'Ed25519', importName: 'Ed25519', kty: 'OKP', signatureBytes: 64, verifyName: 'Ed25519' },
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseAlgorithm(value: unknown): JwtAsymmetricAlgorithm {
  if (typeof value !== 'string' || !(value in algorithmProfiles)) {
    throw new TypeError('JWT alg must be one of RS256/384/512, PS256/384/512, ES256/384/512, or EdDSA.');
  }
  return value as JwtAsymmetricAlgorithm;
}

function assertSupportedHeader(header: JsonRecord) {
  if (header.b64 === false) {
    throw new TypeError('JWTs with an unencoded payload (b64=false) are not supported.');
  }
  if (header.crit !== undefined) {
    throw new TypeError('JWT crit extensions are not supported by this verifier.');
  }
  if (header.kid !== undefined && (typeof header.kid !== 'string' || header.kid.length === 0 || header.kid.length > 256)) {
    throw new TypeError('JWT kid must be a non-empty string of at most 256 characters.');
  }
}

function decodeCanonicalBase64Url(value: unknown, label: string) {
  if (typeof value !== 'string' || !value || !/^[A-Za-z0-9_-]+$/u.test(value)) {
    throw new TypeError(`${label} must be canonical Base64url without padding.`);
  }
  const bytes = Base64.toUint8Array(value);
  if (Base64.fromUint8Array(bytes, true) !== value) {
    throw new TypeError(`${label} must be canonical Base64url without padding.`);
  }
  return bytes;
}

function assertPublicJwk(jwk: JwkRecord, algorithm: JwtAsymmetricAlgorithm) {
  const profile = algorithmProfiles[algorithm];
  if (jwk.kty !== profile.kty) {
    throw new TypeError(`${algorithm} requires a ${profile.kty} public JWK.`);
  }
  if (jwk.d !== undefined || jwk.p !== undefined || jwk.q !== undefined || jwk.dp !== undefined
    || jwk.dq !== undefined || jwk.qi !== undefined || jwk.oth !== undefined) {
    throw new TypeError('Private JWK parameters are not accepted; provide a public key only.');
  }
  const allowedJwkAlgorithms = algorithm === 'EdDSA' ? ['EdDSA', 'Ed25519'] : [algorithm];
  if (jwk.alg !== undefined && !allowedJwkAlgorithms.includes(String(jwk.alg))) {
    throw new TypeError(`JWK alg ${String(jwk.alg)} does not match JWT alg ${algorithm}.`);
  }
  if (jwk.use !== undefined && jwk.use !== 'sig') {
    throw new TypeError('JWK use must be "sig" when present.');
  }
  if (jwk.key_ops !== undefined
    && (!Array.isArray(jwk.key_ops) || !jwk.key_ops.every(value => typeof value === 'string') || !jwk.key_ops.includes('verify'))) {
    throw new TypeError('JWK key_ops must include "verify" when present.');
  }

  if (profile.kty === 'RSA') {
    const modulus = decodeCanonicalBase64Url(jwk.n, 'RSA JWK n');
    const exponent = decodeCanonicalBase64Url(jwk.e, 'RSA JWK e');
    if (modulus.byteLength < 256 || modulus.byteLength > 1_024 || modulus[0] === 0) {
      throw new RangeError('RSA public modulus must be a canonical 2,048–8,192-bit value.');
    }
    if (exponent.byteLength > 4 || exponent.every(byte => byte === 0)) {
      throw new RangeError('RSA public exponent is outside the supported range.');
    }
  }
  else if (profile.kty === 'EC') {
    if (jwk.crv !== profile.curve) {
      throw new TypeError(`${algorithm} requires the ${profile.curve} curve.`);
    }
    const coordinateBytes = profile.curve === 'P-256' ? 32 : profile.curve === 'P-384' ? 48 : 66;
    if (decodeCanonicalBase64Url(jwk.x, 'EC JWK x').byteLength !== coordinateBytes
      || decodeCanonicalBase64Url(jwk.y, 'EC JWK y').byteLength !== coordinateBytes) {
      throw new RangeError(`${profile.curve} JWK coordinates must each contain ${coordinateBytes} bytes.`);
    }
  }
  else {
    if (jwk.crv !== 'Ed25519' || decodeCanonicalBase64Url(jwk.x, 'Ed25519 JWK x').byteLength !== 32) {
      throw new TypeError('EdDSA requires a 32-byte Ed25519 public JWK.');
    }
  }
}

function isCompatibleJwk(value: unknown, algorithm: JwtAsymmetricAlgorithm) {
  if (!isRecord(value)) {
    return false;
  }
  const profile = algorithmProfiles[algorithm];
  return value.kty === profile.kty
    && ((profile.kty !== 'EC' && profile.kty !== 'OKP') || value.crv === profile.curve)
    && (value.alg === undefined || value.alg === algorithm || (algorithm === 'EdDSA' && value.alg === 'Ed25519'))
    && (value.use === undefined || value.use === 'sig')
    && (value.key_ops === undefined || (Array.isArray(value.key_ops) && value.key_ops.includes('verify')));
}

function assertBoundedKeyJson(value: unknown) {
  let nodes = 0;
  const stack: unknown[] = [value];
  while (stack.length) {
    const current = stack.pop();
    nodes += 1;
    if (nodes > JWT_MAX_KEY_NODES) {
      throw new RangeError('JWK/JWKS exceeds the JSON structure limit.');
    }
    if (Array.isArray(current)) {
      stack.push(...current);
    }
    else if (isRecord(current)) {
      stack.push(...Object.values(current));
    }
  }
}

function selectJwk(text: string, algorithm: JwtAsymmetricAlgorithm, headerKid: string | undefined) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  }
  catch {
    throw new TypeError('Public key input must contain valid JWK/JWKS JSON or one SPKI PEM block.');
  }
  assertBoundedKeyJson(parsed);
  if (!isRecord(parsed)) {
    throw new TypeError('JWK/JWKS input must be a JSON object.');
  }

  const isSet = Object.prototype.hasOwnProperty.call(parsed, 'keys');
  const keys = isSet ? parsed.keys : [parsed];
  if (!Array.isArray(keys) || keys.length === 0 || keys.length > JWT_MAX_JWKS_KEYS) {
    throw new RangeError(`JWKS keys must contain 1–${JWT_MAX_JWKS_KEYS} public keys.`);
  }
  if (!keys.every(isRecord)) {
    throw new TypeError('Every JWKS keys entry must be a JWK object.');
  }

  let selected: Record<string, unknown> | undefined;
  if (headerKid !== undefined) {
    const matches = keys.filter(key => key.kid === headerKid);
    if (matches.length !== 1) {
      throw new TypeError(matches.length === 0
        ? `No local public key matches JWT kid "${headerKid}".`
        : `JWT kid "${headerKid}" matches more than one local key.`);
    }
    selected = matches[0];
  }
  else if (!isSet) {
    selected = keys[0];
  }
  else {
    const compatible = keys.filter(key => isCompatibleJwk(key, algorithm));
    if (compatible.length !== 1) {
      throw new TypeError(compatible.length === 0
        ? `No local public key is compatible with JWT alg ${algorithm}.`
        : 'JWT has no kid and more than one compatible local public key exists.');
    }
    selected = compatible[0];
  }

  const jwk = selected as JwkRecord;
  if (jwk.kid !== undefined && (typeof jwk.kid !== 'string' || jwk.kid.length > 256)) {
    throw new TypeError('JWK kid must be a string of at most 256 characters.');
  }
  assertPublicJwk(jwk, algorithm);
  return { jwk, keyId: typeof jwk.kid === 'string' ? jwk.kid : undefined, keySource: isSet ? 'jwks' as const : 'jwk' as const };
}

function parseSpkiPem(text: string) {
  const match = /^-----BEGIN PUBLIC KEY-----\r?\n([A-Za-z0-9+/=\r\n]+)\r?\n-----END PUBLIC KEY-----$/u.exec(text);
  if (!match) {
    throw new TypeError('PEM input must contain exactly one unencrypted SPKI PUBLIC KEY block.');
  }
  const base64 = match[1].replace(/\s/gu, '');
  if (!base64 || base64.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(base64)) {
    throw new TypeError('SPKI PEM body is not canonical Base64.');
  }
  return Base64.toUint8Array(base64);
}

function importAlgorithm(algorithm: JwtAsymmetricAlgorithm): AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams {
  const profile = algorithmProfiles[algorithm];
  if (profile.importName === 'Ed25519') {
    return { name: 'Ed25519' };
  }
  if (profile.importName === 'ECDSA') {
    return { name: 'ECDSA', namedCurve: profile.curve };
  }
  return { name: profile.importName, hash: profile.hash };
}

function verificationAlgorithm(algorithm: JwtAsymmetricAlgorithm): AlgorithmIdentifier | RsaPssParams | EcdsaParams {
  const profile = algorithmProfiles[algorithm];
  if (profile.verifyName === 'RSA-PSS') {
    return { name: 'RSA-PSS', saltLength: profile.saltLength };
  }
  if (profile.verifyName === 'ECDSA') {
    return { name: 'ECDSA', hash: profile.hash };
  }
  return { name: profile.verifyName };
}

export async function verifyJwtWithPublicKey({ token, publicKey }: { token: string; publicKey: string }): Promise<JwtAsymmetricVerificationResult> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto is unavailable in this browser.');
  }
  if (encoder.encode(publicKey).byteLength > JWT_MAX_PUBLIC_KEY_BYTES) {
    throw new RangeError(`Public key input exceeds ${JWT_MAX_PUBLIC_KEY_BYTES.toLocaleString('en-US')} UTF-8 bytes.`);
  }
  const normalizedKey = publicKey.trim();
  if (!normalizedKey) {
    throw new TypeError('Provide a local public JWK, JWKS, or SPKI PEM key.');
  }

  const parsed = parseJwtCompact(token);
  assertSupportedHeader(parsed.header);
  const algorithm = parseAlgorithm(parsed.header.alg);
  if (!parsed.signature) {
    throw new TypeError('Asymmetric JWT verification requires a signature.');
  }
  const signature = decodeCanonicalBase64Url(parsed.signature, 'JWT signature');
  const profile = algorithmProfiles[algorithm];
  const expectedSignatureBytes = 'signatureBytes' in profile ? profile.signatureBytes : undefined;
  if (expectedSignatureBytes !== undefined && signature.byteLength !== expectedSignatureBytes) {
    throw new RangeError(`${algorithm} signatures must contain exactly ${expectedSignatureBytes} bytes.`);
  }

  let keyData: JsonWebKey | Uint8Array;
  let keyId: string | undefined;
  let keySource: JwtAsymmetricVerificationResult['keySource'];
  if (normalizedKey.startsWith('{')) {
    const selection = selectJwk(normalizedKey, algorithm, parsed.header.kid as string | undefined);
    keyData = selection.jwk;
    keyId = selection.keyId;
    keySource = selection.keySource;
  }
  else {
    keyData = parseSpkiPem(normalizedKey);
    keySource = 'spki';
  }

  let key: CryptoKey;
  try {
    key = keyData instanceof Uint8Array
      ? await globalThis.crypto.subtle.importKey('spki', keyData, importAlgorithm(algorithm), false, ['verify'])
      : await globalThis.crypto.subtle.importKey('jwk', keyData, importAlgorithm(algorithm), false, ['verify']);
  }
  catch {
    throw new TypeError(`The local public key could not be imported for ${algorithm}.`);
  }
  const verified = await globalThis.crypto.subtle.verify(
    verificationAlgorithm(algorithm),
    key,
    signature,
    encoder.encode(parsed.signingInput),
  );
  return { algorithm, header: parsed.header, keyId, keySource, payload: parsed.payload, verified };
}
