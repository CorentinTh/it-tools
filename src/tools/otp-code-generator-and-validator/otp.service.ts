import { HmacSHA1, enc } from 'crypto-js';
import _ from 'lodash';
import { createToken } from '../token-generator/token-generator.service';
import type { RandomValuesProvider } from '@/utils/secure-random';

export {
  generateHOTP,
  hexToBytes,
  verifyHOTP,
  generateTOTP,
  verifyTOTP,
  buildKeyUri,
  generateSecret,
  base32toHex,
  getCounterFromTime,
};

const MAX_OTP_COUNTER = (1n << 64n) - 1n;
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const MAX_BASE32_SECRET_LENGTH = 512;

function hexToBytes(hex: string) {
  return (hex.match(/.{1,2}/g) ?? []).map(char => Number.parseInt(char, 16));
}

function computeHMACSha1(message: string, key: string) {
  return HmacSHA1(enc.Hex.parse(message), enc.Hex.parse(base32toHex(key))).toString(enc.Hex);
}

function base32toHex(base32: string) {
  const normalized = base32.trim().toUpperCase().replace(/=+$/u, '');
  if (!normalized || !/^[A-Z2-7]+$/u.test(normalized)) {
    throw new TypeError('Secret must be a non-empty RFC 4648 Base32 string.');
  }
  if (normalized.length > MAX_BASE32_SECRET_LENGTH) {
    throw new RangeError(`Base32 secret must not exceed ${MAX_BASE32_SECRET_LENGTH} characters.`);
  }

  const bits = normalized
    .split('')
    .map(value => BASE32_ALPHABET.indexOf(value).toString(2).padStart(5, '0'))
    .join('');

  const hex = (bits.match(/.{1,8}/g) ?? []).map(chunk => Number.parseInt(chunk, 2).toString(16).padStart(2, '0')).join('');

  return hex;
}

function normalizeCounter(counter: number | bigint) {
  const normalized = typeof counter === 'bigint' ? counter : BigInt(counter);
  if ((typeof counter === 'number' && !Number.isSafeInteger(counter)) || normalized < 0n || normalized > MAX_OTP_COUNTER) {
    throw new RangeError('Counter must be an integer from 0 to 2^64 - 1.');
  }
  return normalized;
}

function generateHOTP({ key, counter = 0, digits = 6 }: { key: string; counter?: number | bigint; digits?: 6 | 8 }) {
  if (digits !== 6 && digits !== 8) {
    throw new RangeError('OTP digits must be 6 or 8.');
  }
  const normalizedCounter = normalizeCounter(counter);
  // Compute HMACdigest
  const digest = computeHMACSha1(normalizedCounter.toString(16).padStart(16, '0'), key);

  // Get byte array
  const bytes = hexToBytes(digest);

  // Truncate
  const offset = bytes[19] & 0xF;
  const v
    = ((bytes[offset] & 0x7F) << 24)
    | ((bytes[offset + 1] & 0xFF) << 16)
    | ((bytes[offset + 2] & 0xFF) << 8)
    | (bytes[offset + 3] & 0xFF);

  const modulus = digits === 6 ? 1_000_000 : 100_000_000;
  const code = String(v % modulus).padStart(digits, '0');

  return code;
}

function verifyHOTP({
  token,
  key,
  window = 0,
  counter = 0,
  digits = 6,
}: {
  token: string
  key: string
  window?: number
  counter?: number | bigint
  digits?: 6 | 8
}) {
  if (!Number.isInteger(window) || window < 0 || window > 100) {
    throw new RangeError('Verification window must be an integer from 0 to 100.');
  }
  const normalizedCounter = normalizeCounter(counter);
  for (let offset = -window; offset <= window; offset += 1) {
    const candidate = normalizedCounter + BigInt(offset);
    if (candidate >= 0n && candidate <= MAX_OTP_COUNTER && generateHOTP({ key, counter: candidate, digits }) === token) {
      return true;
    }
  }

  return false;
}

function getCounterFromTime({ now, timeStep }: { now: number; timeStep: number }) {
  return Math.floor(now / 1000 / timeStep);
}

function generateTOTP({ key, now = Date.now(), timeStep = 30, digits = 6 }: { key: string; now?: number; timeStep?: number; digits?: 6 | 8 }) {
  const counter = getCounterFromTime({ now, timeStep });

  return generateHOTP({ key, counter, digits });
}

function verifyTOTP({
  key,
  token,
  window = 0,
  now = Date.now(),
  timeStep = 30,
  digits = 6,
}: {
  token: string
  key: string
  window?: number
  now?: number
  timeStep?: number
  digits?: 6 | 8
}) {
  const counter = getCounterFromTime({ now, timeStep });

  return verifyHOTP({ token, key, window, counter, digits });
}

function buildKeyUri({
  secret,
  app = 'IT-Tools',
  account = 'demo-user',
  algorithm = 'SHA1',
  digits = 6,
  period = 30,
  type = 'totp',
  counter = 0n,
}: {
  secret: string
  app?: string
  account?: string
  algorithm?: string
  digits?: number
  period?: number
  type?: 'totp' | 'hotp'
  counter?: number | bigint
}) {
  const params: Record<string, string | number> = {
    issuer: app,
    secret,
    algorithm,
    digits,
  };
  if (type === 'totp') {
    params.period = period;
  }
  else {
    params.counter = normalizeCounter(counter).toString();
  }

  const paramsString = _(params)
    .map((value, key) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `otpauth://${type}/${encodeURIComponent(app)}:${encodeURIComponent(account)}?${paramsString}`;
}

function generateSecret({ getRandomValues }: { getRandomValues?: RandomValuesProvider } = {}) {
  return createToken({ length: 16, alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', getRandomValues });
}
