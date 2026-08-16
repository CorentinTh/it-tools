export type FloatFormat = 'binary32' | 'binary64';

export interface FloatInspection {
  format: FloatFormat
  parsedValue: string
  classification: 'zero' | 'subnormal' | 'normal' | 'infinity' | 'nan'
  signBit: string
  exponentBits: string
  fractionBits: string
  unbiasedExponent: string
  bigEndianHex: string
  littleEndianHex: string
  exactStoredValue: string
  roundingError: string
}

interface Rational { numerator: bigint; denominator: bigint }

function gcd(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function reduce(value: Rational): Rational {
  if (value.numerator === 0n) {
    return { numerator: 0n, denominator: 1n };
  }
  const divisor = gcd(value.numerator, value.denominator);
  return { numerator: value.numerator / divisor, denominator: value.denominator / divisor };
}

function parseExactDecimal(source: string): { value: number; rational?: Rational } {
  const trimmed = source.trim();
  if (/^[+-]?Infinity$/u.test(trimmed)) {
    return { value: trimmed.startsWith('-') ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY };
  }
  if (/^[+-]?NaN$/iu.test(trimmed)) {
    return { value: Number.NaN };
  }
  if (trimmed.length > 512) {
    throw new RangeError('Decimal input is limited to 512 characters.');
  }
  const match = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:[eE]([+-]?\d+))?$/u.exec(trimmed);
  if (!match) {
    throw new TypeError('Enter a decimal number, optional exponent, Infinity, -Infinity, or NaN.');
  }
  const integer = match[2] ?? '0';
  const fraction = match[3] ?? match[4] ?? '';
  const exponent = Number(match[5] ?? '0');
  if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > 400) {
    throw new RangeError('Decimal exponent must be between -400 and 400.');
  }
  let numerator = BigInt(`${integer}${fraction}` || '0');
  let denominator = 10n ** BigInt(fraction.length);
  if (exponent >= 0) {
    numerator *= 10n ** BigInt(exponent);
  }
  else {
    denominator *= 10n ** BigInt(-exponent);
  }
  if (match[1] === '-') {
    numerator = -numerator;
  }
  const value = Number(trimmed);
  return { value, rational: reduce({ numerator, denominator }) };
}

function formatRational(value: Rational): string {
  const reduced = reduce(value);
  const negative = reduced.numerator < 0n;
  const numerator = negative ? -reduced.numerator : reduced.numerator;
  const integer = numerator / reduced.denominator;
  let remainder = numerator % reduced.denominator;
  if (remainder === 0n) {
    return `${negative ? '-' : ''}${integer}`;
  }
  let fraction = '';
  for (let index = 0; index < 1200 && remainder !== 0n; index += 1) {
    remainder *= 10n;
    fraction += (remainder / reduced.denominator).toString();
    remainder %= reduced.denominator;
  }
  return `${negative ? '-' : ''}${integer}.${fraction}${remainder === 0n ? '' : '…'}`;
}

function storedRational(sign: bigint, exponent: bigint, fraction: bigint, exponentBits: number, fractionBits: number): Rational {
  const maximumExponent = (1n << BigInt(exponentBits)) - 1n;
  if (exponent === maximumExponent) {
    throw new TypeError('Non-finite values do not have a finite exact rational value.');
  }
  const bias = (1 << (exponentBits - 1)) - 1;
  const significand = exponent === 0n ? fraction : (1n << BigInt(fractionBits)) + fraction;
  const power = exponent === 0n ? 1 - bias - fractionBits : Number(exponent) - bias - fractionBits;
  const signedSignificand = sign === 1n ? -significand : significand;
  return power >= 0
    ? { numerator: signedSignificand << BigInt(power), denominator: 1n }
    : reduce({ numerator: signedSignificand, denominator: 1n << BigInt(-power) });
}

function subtract(left: Rational, right: Rational): Rational {
  return reduce({
    numerator: left.numerator * right.denominator - right.numerator * left.denominator,
    denominator: left.denominator * right.denominator,
  });
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join(' ');
}

export function inspectFloat(source: string, format: FloatFormat): FloatInspection {
  const parsed = parseExactDecimal(source);
  const is32 = format === 'binary32';
  const byteLength = is32 ? 4 : 8;
  const exponentLength = is32 ? 8 : 11;
  const fractionLength = is32 ? 23 : 52;
  const buffer = new ArrayBuffer(byteLength);
  const view = new DataView(buffer);
  if (is32) {
    view.setFloat32(0, parsed.value, false);
  }
  else {
    view.setFloat64(0, parsed.value, false);
  }
  const bytes = new Uint8Array(buffer);
  const bits = is32 ? BigInt(view.getUint32(0, false)) : view.getBigUint64(0, false);
  const sign = bits >> BigInt(exponentLength + fractionLength);
  const exponentMask = (1n << BigInt(exponentLength)) - 1n;
  const fractionMask = (1n << BigInt(fractionLength)) - 1n;
  const exponent = (bits >> BigInt(fractionLength)) & exponentMask;
  const fraction = bits & fractionMask;
  const classification = exponent === exponentMask
    ? (fraction === 0n ? 'infinity' : 'nan')
    : exponent === 0n
      ? (fraction === 0n ? 'zero' : 'subnormal')
      : 'normal';
  const rational = classification === 'infinity' || classification === 'nan'
    ? undefined
    : storedRational(sign, exponent, fraction, exponentLength, fractionLength);
  const exactStoredValue = rational
    ? (classification === 'zero' && sign === 1n ? '-0' : formatRational(rational))
    : classification === 'nan' ? 'NaN (payload shown in fraction bits)' : sign === 1n ? '-Infinity' : 'Infinity';
  const roundingError = rational && parsed.rational
    ? formatRational(subtract(rational, parsed.rational))
    : 'Not applicable to non-finite input.';
  const bias = (1 << (exponentLength - 1)) - 1;
  return {
    format,
    parsedValue: is32 ? Math.fround(parsed.value).toString() : parsed.value.toString(),
    classification,
    signBit: sign.toString(),
    exponentBits: exponent.toString(2).padStart(exponentLength, '0'),
    fractionBits: fraction.toString(2).padStart(fractionLength, '0'),
    unbiasedExponent: classification === 'normal' ? (Number(exponent) - bias).toString() : classification === 'subnormal' ? `${1 - bias} (subnormal effective exponent)` : 'not applicable',
    bigEndianHex: bytesToHex(bytes),
    littleEndianHex: bytesToHex(Uint8Array.from(bytes).reverse()),
    exactStoredValue,
    roundingError,
  };
}
