import type { lib } from 'crypto-js';
import { HmacMD5, HmacRIPEMD160, HmacSHA1, HmacSHA224, HmacSHA256, HmacSHA3, HmacSHA384, HmacSHA512, enc } from 'crypto-js';
import { convertHexToBin } from '../hash-text/hash-text.service';

export const HMAC_ALGORITHMS = ['SHA256', 'SHA384', 'SHA512', 'SHA224', 'SHA1', 'MD5', 'RIPEMD160', 'SHA3'] as const;
export type HmacAlgorithm = typeof HMAC_ALGORITHMS[number];
export const HMAC_KEY_ENCODINGS = ['text', 'hex', 'base64'] as const;
export type HmacKeyEncoding = typeof HMAC_KEY_ENCODINGS[number];
export const HMAC_OUTPUT_ENCODINGS = ['Hex', 'Base64', 'Base64url', 'Bin'] as const;
export type HmacOutputEncoding = typeof HMAC_OUTPUT_ENCODINGS[number];

export interface HmacTask {
  message: string
  key: string
  algorithm: HmacAlgorithm
  keyEncoding: HmacKeyEncoding
  outputEncoding: HmacOutputEncoding
}

const algorithms: Record<HmacAlgorithm, (message: string | lib.WordArray, key: lib.WordArray) => lib.WordArray> = {
  MD5: HmacMD5,
  RIPEMD160: HmacRIPEMD160,
  SHA1: HmacSHA1,
  SHA3: HmacSHA3,
  SHA224: HmacSHA224,
  SHA256: HmacSHA256,
  SHA384: HmacSHA384,
  SHA512: HmacSHA512,
};

function parseKey(value: string, encoding: HmacKeyEncoding): lib.WordArray {
  if (encoding === 'text') {
    return enc.Utf8.parse(value);
  }
  if (encoding === 'hex') {
    if (!/^(?:[0-9a-fA-F]{2})*$/.test(value)) {
      throw new Error('Hex keys must contain complete byte pairs only.');
    }
    return enc.Hex.parse(value);
  }
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    throw new Error('Base64 keys must use the canonical RFC 4648 alphabet and padding.');
  }
  const parsed = enc.Base64.parse(value);
  if (parsed.toString(enc.Base64) !== value) {
    throw new Error('Base64 key is not canonical.');
  }
  return parsed;
}

function formatResult(value: lib.WordArray, encoding: HmacOutputEncoding): string {
  if (encoding === 'Bin') {
    return convertHexToBin(value.toString(enc.Hex));
  }
  if (encoding === 'Base64url') {
    return value.toString(enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }
  return value.toString(enc[encoding]);
}

export function computeHmac(task: HmacTask): string {
  const key = parseKey(task.key, task.keyEncoding);
  if (key.sigBytes > 4_096) {
    throw new Error('Decoded HMAC keys are limited to 4 KiB.');
  }
  return formatResult(algorithms[task.algorithm](enc.Utf8.parse(task.message), key), task.outputEncoding);
}
