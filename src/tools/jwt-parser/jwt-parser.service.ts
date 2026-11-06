import type { JwtHeader } from 'jwt-decode';
import { CompactSign, compactVerify, importJWK, importPKCS8, importSPKI, importX509 } from 'jose';
import { Base64 } from 'js-base64';
import { jwtDecode } from 'jwt-decode';
import { isValidBase64, removePotentialDataAndMimePrefix } from '@/utils/base64';
import { withDefaultOnError } from '@/utils/defaults';

export {
  buildShareUrl,
  decodeJwt,
  getSignatureFunctionName,
  hasUnsafeInteger,
  isSupportedAlgorithm,
  isSymmetricAlgorithm,
  JWT_ALGORITHMS,
  readSharedJwt,
  signJwt,
  verifyJwt,
};
export type { JwtAlgorithm, JwtKeys, SignatureStatus };

const JWT_ALGORITHMS = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'ES256',
  'ES384',
  'ES512',
  'PS256',
  'PS384',
  'PS512',
] as const;

type JwtAlgorithm = (typeof JWT_ALGORITHMS)[number];

type SignatureStatus
  = | 'verified'
    | 'invalid'
    | 'invalid-secret'
    | 'invalid-public-key'
    | 'missing-secret'
    | 'missing-public-key'
    | 'unsupported-algorithm';

interface JwtKeys {
  secret: string
  isSecretBase64: boolean
  publicKey: string
  privateKey: string
}

const SHARE_HASH_PREFIX = '#token=';

const SIGNATURE_FUNCTION_PREFIXES: Record<string, string> = {
  HS: 'HMACSHA',
  RS: 'RSASHA',
  ES: 'ECDSASHA',
  PS: 'RSAPSSSHA',
};

function isSupportedAlgorithm(algorithm: unknown): algorithm is JwtAlgorithm {
  return JWT_ALGORITHMS.includes(algorithm as JwtAlgorithm);
}

function isSymmetricAlgorithm(algorithm: JwtAlgorithm) {
  return algorithm.startsWith('HS');
}

function getSignatureFunctionName(algorithm: JwtAlgorithm) {
  return `${SIGNATURE_FUNCTION_PREFIXES[algorithm.slice(0, 2)]}${algorithm.slice(2)}`;
}

function decodeJwt({ jwt }: { jwt: string }) {
  return {
    header: JSON.stringify(jwtDecode(jwt, { header: true }), null, 2),
    payload: JSON.stringify(jwtDecode(jwt), null, 2),
  };
}

async function signJwt({ header, payload, keys }: { header: string; payload: string; keys: JwtKeys }) {
  const protectedHeader = parseJson({ text: header, name: 'header' });
  const parsedPayload = parseJson({ text: payload, name: 'payload' });
  const algorithm = protectedHeader?.alg;

  if (!isSupportedAlgorithm(algorithm)) {
    throw new Error(`The algorithm ${algorithm} is not supported.`);
  }

  return new CompactSign(new TextEncoder().encode(JSON.stringify(parsedPayload)))
    .setProtectedHeader(protectedHeader)
    .sign(await importSigningKey({ algorithm, keys }));
}

async function verifyJwt({ jwt, keys }: { jwt: string; keys: JwtKeys }): Promise<SignatureStatus> {
  let algorithm: string | undefined;

  try {
    algorithm = jwtDecode<JwtHeader>(jwt, { header: true }).alg;
  }
  catch {
    return 'invalid';
  }

  if (!isSupportedAlgorithm(algorithm)) {
    return 'unsupported-algorithm';
  }

  const isSymmetric = isSymmetricAlgorithm(algorithm);

  if (!hasVerificationKey({ algorithm, keys })) {
    return isSymmetric ? 'missing-secret' : 'missing-public-key';
  }

  let key: Awaited<ReturnType<typeof importVerificationKey>>;

  try {
    key = await importVerificationKey({ algorithm, keys });
  }
  catch {
    return isSymmetric ? 'invalid-secret' : 'invalid-public-key';
  }

  try {
    await compactVerify(jwt, key, { algorithms: [algorithm] });
    return 'verified';
  }
  catch {
    return 'invalid';
  }
}

function buildShareUrl({ url, jwt }: { url: string; jwt: string }) {
  const shareUrl = new URL(url);
  shareUrl.hash = `${SHARE_HASH_PREFIX}${jwt}`;
  return shareUrl.toString();
}

function readSharedJwt({ hash }: { hash: string }) {
  const jwt = hash.startsWith(SHARE_HASH_PREFIX) ? hash.slice(SHARE_HASH_PREFIX.length) : '';
  return jwt.length > 0 ? jwt : undefined;
}

// The decoded payload is already rounded by JSON.parse, so the raw token is the only source of the original digits.
function hasUnsafeInteger({ jwt, payload }: { jwt: string; payload: string }) {
  const rawPayload = withDefaultOnError(() => Base64.decode(jwt.split('.')[1] ?? ''), '');
  return [rawPayload, payload].some(containsUnsafeInteger);
}

function containsUnsafeInteger(json: string) {
  const jsonWithoutStrings = json.replace(/"(?:[^"\\]|\\.)*"/g, '""');
  const longIntegers = jsonWithoutStrings.match(/(?<![.\de])\d{16,}(?![.\de])/gi) ?? [];
  return longIntegers.some(integer => !Number.isSafeInteger(Number(integer)));
}

function parseJson({ text, name }: { text: string; name: string }) {
  try {
    return JSON.parse(text);
  }
  catch {
    throw new Error(`The ${name} is not valid JSON.`);
  }
}

function hasVerificationKey({ algorithm, keys }: { algorithm: JwtAlgorithm; keys: JwtKeys }) {
  return isSymmetricAlgorithm(algorithm) ? keys.secret.length > 0 : keys.publicKey.trim().length > 0;
}

function importSecret({ secret, isSecretBase64 }: JwtKeys) {
  if (secret.length === 0) {
    throw new Error('Enter a secret to sign the token.');
  }

  if (!isSecretBase64) {
    return new TextEncoder().encode(secret);
  }

  if (!isValidBase64(secret, { makeUrlSafe: true })) {
    throw new Error('The secret is not valid base64.');
  }

  return Base64.toUint8Array(removePotentialDataAndMimePrefix(secret));
}

async function importSigningKey({ algorithm, keys }: { algorithm: JwtAlgorithm; keys: JwtKeys }) {
  if (isSymmetricAlgorithm(algorithm)) {
    return importSecret(keys);
  }

  const privateKey = keys.privateKey.trim();

  if (privateKey.length === 0) {
    throw new Error('Enter a private key to sign the token.');
  }

  try {
    return await importPrivateKey({ privateKey, algorithm });
  }
  catch {
    throw new Error(`The private key is not valid for ${algorithm}.`);
  }
}

async function importVerificationKey({ algorithm, keys }: { algorithm: JwtAlgorithm; keys: JwtKeys }) {
  return isSymmetricAlgorithm(algorithm)
    ? importSecret(keys)
    : importPublicKey({ publicKey: keys.publicKey.trim(), algorithm });
}

async function importAsymmetricJwk({ jwk, algorithm, keyType }: { jwk: string; algorithm: JwtAlgorithm; keyType: 'public' | 'private' }) {
  const key = await importJWK(JSON.parse(jwk), algorithm);

  if (key instanceof Uint8Array || key.type !== keyType) {
    throw new Error(`The JWK is not a ${keyType} key.`);
  }

  return key;
}

async function importPublicKey({ publicKey, algorithm }: { publicKey: string; algorithm: JwtAlgorithm }) {
  if (publicKey.startsWith('{')) {
    return importAsymmetricJwk({ jwk: publicKey, algorithm, keyType: 'public' });
  }

  if (publicKey.includes('BEGIN CERTIFICATE')) {
    return importX509(publicKey, algorithm);
  }

  if (publicKey.includes('BEGIN RSA PUBLIC KEY')) {
    return importSPKI(await convertPkcs1PublicKeyToSpki(publicKey), algorithm);
  }

  return importSPKI(publicKey, algorithm);
}

async function importPrivateKey({ privateKey, algorithm }: { privateKey: string; algorithm: JwtAlgorithm }) {
  if (privateKey.startsWith('{')) {
    return importAsymmetricJwk({ jwk: privateKey, algorithm, keyType: 'private' });
  }

  if (privateKey.includes('BEGIN RSA PRIVATE KEY')) {
    return importPKCS8(await convertPkcs1PrivateKeyToPkcs8(privateKey), algorithm);
  }

  return importPKCS8(privateKey, algorithm);
}

// jose only accepts SPKI and PKCS#8 PEM. The dynamic import keeps node-forge out of the page chunk.
async function convertPkcs1PublicKeyToSpki(publicKey: string) {
  const { pki } = await import('node-forge');
  return pki.publicKeyToPem(pki.publicKeyFromPem(publicKey));
}

async function convertPkcs1PrivateKeyToPkcs8(privateKey: string) {
  const { pki } = await import('node-forge');
  const rsaPrivateKey = pki.privateKeyToAsn1(pki.privateKeyFromPem(privateKey));
  return pki.privateKeyInfoToPem(pki.wrapRsaPrivateKey(rsaPrivateKey));
}
