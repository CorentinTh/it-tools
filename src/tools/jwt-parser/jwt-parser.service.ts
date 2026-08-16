import { Base64 } from 'js-base64';
import { ALGORITHM_DESCRIPTIONS, CLAIM_DESCRIPTIONS } from './jwt-parser.constants';

export type JwtWorkspaceAlgorithm = 'none' | 'HS256' | 'HS384' | 'HS512';
export type JsonRecord = Record<string, unknown>;

export const JWT_MAX_JSON_BYTES = 64 * 1024;
export const JWT_MAX_TOKEN_BYTES = 256 * 1024;
const JWT_MAX_NODES = 10_000;
const JWT_MAX_DEPTH = 64;
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });

export { decodeJwt, parseJwtCompact, signJwt, verifyJwt, describeTemporalClaims };

function assertBoundedText(value: string, maxBytes: number, label: string) {
  if (encoder.encode(value).byteLength > maxBytes) {
    throw new RangeError(`${label} exceeds ${maxBytes.toLocaleString('en-US')} UTF-8 bytes.`);
  }
}

function assertJsonShape(root: unknown, label: string): asserts root is JsonRecord {
  if (root === null || typeof root !== 'object' || Array.isArray(root)) {
    throw new TypeError(`${label} must be a JSON object.`);
  }
  let nodes = 0;
  const stack: Array<{ depth: number; value: unknown }> = [{ depth: 0, value: root }];
  while (stack.length) {
    const current = stack.pop()!;
    nodes += 1;
    if (nodes > JWT_MAX_NODES || current.depth > JWT_MAX_DEPTH) {
      throw new RangeError(`${label} exceeds the JSON structure limit.`);
    }
    if (current.value && typeof current.value === 'object') {
      for (const value of Object.values(current.value)) {
        stack.push({ depth: current.depth + 1, value });
      }
    }
  }
}

function parseJsonObject(text: string, label: string) {
  assertBoundedText(text, JWT_MAX_JSON_BYTES, label);
  let value: unknown;
  try {
    value = JSON.parse(text);
  }
  catch {
    throw new TypeError(`${label} must contain valid JSON.`);
  }
  assertJsonShape(value, label);
  return value;
}

function encodeJson(value: JsonRecord) {
  return Base64.fromUint8Array(encoder.encode(JSON.stringify(value)), true);
}

function decodeSegment(segment: string, label: string) {
  if (!segment || !/^[A-Za-z0-9_-]+$/u.test(segment)) {
    throw new TypeError(`${label} is not canonical Base64url.`);
  }
  let text: string;
  try {
    text = decoder.decode(Base64.toUint8Array(segment));
  }
  catch {
    throw new TypeError(`${label} is not valid UTF-8 Base64url.`);
  }
  return parseJsonObject(text, label);
}

function parseJwtCompact(token: string) {
  const normalized = token.trim();
  assertBoundedText(normalized, JWT_MAX_TOKEN_BYTES, 'JWT');
  const segments = normalized.split('.');
  if (segments.length !== 3) {
    throw new TypeError('JWT must contain exactly three compact segments.');
  }
  const header = decodeSegment(segments[0], 'JWT header');
  const payload = decodeSegment(segments[1], 'JWT payload');
  if (segments[2] && !/^[A-Za-z0-9_-]+$/u.test(segments[2])) {
    throw new TypeError('JWT signature is not canonical Base64url.');
  }
  return { header, payload, signature: segments[2], signingInput: `${segments[0]}.${segments[1]}`, token: normalized };
}

function algorithmHash(algorithm: Exclude<JwtWorkspaceAlgorithm, 'none'>) {
  return ({ HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' } as const)[algorithm];
}

function minimumSecretBytes(algorithm: Exclude<JwtWorkspaceAlgorithm, 'none'>) {
  return ({ HS256: 32, HS384: 48, HS512: 64 } as const)[algorithm];
}

async function importHmacKey(secret: string, algorithm: Exclude<JwtWorkspaceAlgorithm, 'none'>, usage: KeyUsage) {
  const bytes = encoder.encode(secret);
  const minimum = minimumSecretBytes(algorithm);
  if (bytes.byteLength < minimum || bytes.byteLength > 1024) {
    throw new RangeError(`${algorithm} secret must be ${minimum}–1,024 UTF-8 bytes.`);
  }
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto is unavailable in this browser.');
  }
  return globalThis.crypto.subtle.importKey('raw', bytes, { name: 'HMAC', hash: algorithmHash(algorithm) }, false, [usage]);
}

async function signJwt({ headerJson, payloadJson, algorithm, secret }: { headerJson: string; payloadJson: string; algorithm: JwtWorkspaceAlgorithm; secret: string }) {
  const header = parseJsonObject(headerJson, 'JWT header');
  const payload = parseJsonObject(payloadJson, 'JWT payload');
  header.alg = algorithm;
  if (header.typ === undefined) {
    header.typ = 'JWT';
  }
  const signingInput = `${encodeJson(header)}.${encodeJson(payload)}`;
  if (algorithm === 'none') {
    return `${signingInput}.`;
  }
  const key = await importHmacKey(secret, algorithm, 'sign');
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  return `${signingInput}.${Base64.fromUint8Array(new Uint8Array(signature), true)}`;
}

async function verifyJwt({ token, secret }: { token: string; secret: string }) {
  const parsed = parseJwtCompact(token);
  const algorithm = parsed.header.alg;
  if (algorithm === 'none') {
    return { ...parsed, algorithm: 'none' as const, verified: false, unsigned: true };
  }
  if (algorithm !== 'HS256' && algorithm !== 'HS384' && algorithm !== 'HS512') {
    throw new TypeError('Only none, HS256, HS384, and HS512 are supported by this local workspace.');
  }
  if (!parsed.signature) {
    return { ...parsed, algorithm, verified: false, unsigned: false };
  }
  const key = await importHmacKey(secret, algorithm, 'verify');
  const verified = await globalThis.crypto.subtle.verify('HMAC', key, Base64.toUint8Array(parsed.signature), encoder.encode(parsed.signingInput));
  return { ...parsed, algorithm, verified, unsigned: false };
}

function describeTemporalClaims(payload: JsonRecord, nowSeconds = Math.floor(Date.now() / 1000)) {
  const messages: string[] = [];
  for (const claim of ['iat', 'nbf', 'exp'] as const) {
    if (payload[claim] !== undefined && (typeof payload[claim] !== 'number' || !Number.isFinite(payload[claim]))) {
      messages.push(`${claim} is present but is not a finite NumericDate.`);
    }
  }
  if (typeof payload.nbf === 'number' && payload.nbf > nowSeconds) {
    messages.push('Token is not active yet according to nbf and this browser clock.');
  }
  if (typeof payload.exp === 'number' && payload.exp <= nowSeconds) {
    messages.push('Token is expired according to exp and this browser clock.');
  }
  return messages;
}

function decodeJwt({ jwt }: { jwt: string }) {
  const { header: rawHeader, payload: rawPayload } = parseJwtCompact(jwt);
  return {
    header: Object.entries(rawHeader).map(([claim, value]) => parseClaim(claim, value)),
    payload: Object.entries(rawPayload).map(([claim, value]) => parseClaim(claim, value)),
  };
}

function parseClaim(claim: string, value: unknown) {
  const claimDescription = CLAIM_DESCRIPTIONS[claim];
  const formattedValue = value && typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? '');
  const friendlyValue = getFriendlyValue(claim, value);
  return { value: formattedValue, friendlyValue, claim, claimDescription };
}

function getFriendlyValue(claim: string, value: unknown) {
  if (['exp', 'nbf', 'iat'].includes(claim) && typeof value === 'number' && Number.isFinite(value)) {
    const date = new Date(value * 1000);
    return Number.isNaN(date.valueOf()) ? undefined : date.toISOString();
  }
  if (claim === 'alg' && typeof value === 'string') {
    return ALGORITHM_DESCRIPTIONS[value];
  }
  return undefined;
}
