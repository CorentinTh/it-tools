export function convertDecimalToBinary({ value, bitCount }: { value: string; bitCount: number }) {
  let number = Number.parseFloat(value.replace(/\s/g, ''));
  if (value.match(/^-?inf(inity)?$/i)) {
    // const sign = value.startsWith('-') ? 1 : 0;
    // return `${sign}${'1'.repeat(exponentBits)}${'0'.repeat(mantissaBits)}`;
    number = (value.startsWith('-') ? -2 : 2) / 0;
  }

  switch (bitCount) {
    case 32: { // Single precision
      const uint = new Uint32Array(Float32Array.of(number).buffer);
      return uint[0].toString(2).padStart(32, '0');
    }
    case 64: { // Double precision
      const uint = new Uint32Array(Float64Array.of(number).buffer);
      return [...uint].slice(0, 2).reverse().map(p => p.toString(2).padStart(32, '0')).join('');
    }
    default:
      throw new Error('Unsupported bit count. Only 32 and 64 are allowed.');
  }
}

export function convertBinaryToDecimal({ value, decimalPrecision, removeZeroPadding }: { value: string; decimalPrecision: string; removeZeroPadding: boolean }) {
  if (value.match(/[^01]/)) {
    throw new Error('Not a binary number.');
  }
  if (decimalPrecision.match(/[^\d]/)) {
    throw new Error('Decimal Precision must be a positive whole number.');
  }

  let result: number;
  switch (value.length) {
    case 32: {
      const binary = [Number.parseInt(value, 2)];
      result = (new Float32Array(Uint32Array.from(binary).buffer))[0];
      break;
    }
    case 64: {
      const binary = [Number.parseInt(value.substring(32), 2), Number.parseInt(value.substring(0, 32), 2)];
      result = (new Float64Array(Uint32Array.from(binary).buffer))[0];
      break;
    }
    default:
      throw new Error('Invalid length. Supply a binary string with length 32 or 64.');
  }

  const zeroNegative = result === 0 && 2 / result === Number.NEGATIVE_INFINITY;
  let resultString = decimalPrecision.length === 0 ? result.toString() : result.toFixed(Number.parseInt(decimalPrecision));
  if (removeZeroPadding) {
    resultString = resultString.replace(/\.(\d+?)(0+)$/, '.$1');
  }
  return (zeroNegative ? '-' : '') + resultString;
}

export function calcErrorDueToConversion({ decimalInput, actualValue }: { decimalInput: string; actualValue: string }) {
  return (Number.parseFloat(decimalInput) - Number.parseFloat(actualValue)).toFixed(32).replace(/\.(\d+?)(0+)$/, '.$1');
}
