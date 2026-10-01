import { Base64 } from 'js-base64';

export type HmacAlgorithm = 'HS256' | 'HS384' | 'HS512';

const ALGORITHMS: Record<HmacAlgorithm, string> = {
  HS256: 'SHA-256',
  HS384: 'SHA-384',
  HS512: 'SHA-512',
};

const encoder = new TextEncoder();

const base64UrlEncode = (bytes: Uint8Array) => Base64.fromUint8Array(bytes, true);

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), '='));
}

/** Sign header+payload with an HMAC secret through WebCrypto. */
export async function generateJwt({ header, payload, secret, algorithm }: { header: object; payload: object; secret: string; algorithm: HmacAlgorithm }): Promise<string> {
  if (!secret) {
    throw new Error('A signing secret is required');
  }

  const signedHeader = { ...header, alg: algorithm, typ: 'JWT' };
  const signingInput = [
    base64UrlEncode(encoder.encode(JSON.stringify(signedHeader))),
    base64UrlEncode(encoder.encode(JSON.stringify(payload))),
  ].join('.');

  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: ALGORITHMS[algorithm] }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));

  return `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export interface JwtParts {
  header: string
  payload: string
  signature: string
}

/** Split a JWT into its three decoded parts, for round-trip display. */
export function decodeJwtParts(token: string): JwtParts {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error('A JWT has exactly three parts');
  }
  return {
    header: base64UrlDecode(parts[0]!),
    payload: base64UrlDecode(parts[1]!),
    signature: parts[2]!,
  };
}
