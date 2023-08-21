import { HmacSHA1, enc } from 'crypto-js';
import _ from 'lodash';
import { createToken } from '../token-generator/token-generator.service';

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

function hexToBytes(hex: string) {
  return (hex.match(/.{1,2}/g) ?? []).map(char => Number.parseInt(char, 16));
}

function computeHMACSha1(message: string, key: string) {
  return HmacSHA1(enc.Hex.parse(message), enc.Hex.parse(base32toHex(key))).toString(enc.Hex);
}

function base32toHex(base32: string) {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const bits = base32
    .toUpperCase() // Since base 32, we coerce lowercase to uppercase
    .replace(/=+$/, '')
    .split('')
    .map(value => base32Chars.indexOf(value).toString(2).padStart(5, '0'))
    .join('');

  const hex = (bits.match(/.{1,8}/g) ?? []).map(chunk => Number.parseInt(chunk, 2).toString(16).padStart(2, '0')).join('');

  return hex;
}

function generateHOTP({ key, counter = 0 }: { key: string; counter?: number }) {
  // Compute HMACdigest
  const digest = computeHMACSha1(counter.toString(16).padStart(16, '0'), key);

  // Get byte array
  const bytes = hexToBytes(digest);

  // Truncate
  const offset = bytes[19] & 0xF;
  const v
    = ((bytes[offset] & 0x7F) << 24)
    | ((bytes[offset + 1] & 0xFF) << 16)
    | ((bytes[offset + 2] & 0xFF) << 8)
    | (bytes[offset + 3] & 0xFF);

  const code = String(v % 1000000).padStart(6, '0');

  return code;
}

function verifyHOTP({
  token,
  key,
  window = 0,
  counter = 0,
}: {
  token: string
  key: string
  window?: number
  counter?: number
}) {
  for (let i = counter - window; i <= counter + window; ++i) {
    if (generateHOTP({ key, counter: i }) === token) {
      return true;
    }
  }

  return false;
}

function getCounterFromTime({ now, timeStep }: { now: number; timeStep: number }) {
  return Math.floor(now / 1000 / timeStep);
}

function generateTOTP({ key, now = Date.now(), timeStep = 30 }: { key: string; now?: number; timeStep?: number }) {
  const counter = getCounterFromTime({ now, timeStep });

  return generateHOTP({ key, counter });
}

function verifyTOTP({
  key,
  token,
  window = 0,
  now = Date.now(),
  timeStep = 30,
}: {
  token: string
  key: string
  window?: number
  now?: number
  timeStep?: number
}) {
  const counter = getCounterFromTime({ now, timeStep });

  return verifyHOTP({ token, key, window, counter });
}

function buildKeyUri({
  secret,
  app = 'IT-Tools',
  account = 'demo-user',
  algorithm = 'SHA1',
  digits = 6,
  period = 30,
}: {
  secret: string
  app?: string
  account?: string
  algorithm?: string
  digits?: number
  period?: number
}) {
  const params = {
    issuer: app,
    secret,
    algorithm,
    digits,
    period,
  };

  const paramsString = _(params)
    .map((value, key) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `otpauth://totp/${encodeURIComponent(app)}:${encodeURIComponent(account)}?${paramsString}`;
}

function generateSecret() {
  return createToken({ length: 16, alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' });
}
