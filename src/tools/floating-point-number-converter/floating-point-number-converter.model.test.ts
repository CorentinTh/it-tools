import { describe, expect, it } from 'vitest';
import { convertBinaryToDecimal, convertDecimalToBinary } from './floating-point-number-converter.model';

describe('floating-point-number-converter', () => {
  describe('convertDecimalToBinary', () => {
    it('Should convert a decimal number to a floating point binary number (IEEE-754)', () => {
      // 32-Bit
      expect(convertDecimalToBinary({ value: '0', bitCount: 32 })).toEqual('00000000000000000000000000000000');
      expect(convertDecimalToBinary({ value: '-0', bitCount: 32 })).toEqual('10000000000000000000000000000000');
      expect(convertDecimalToBinary({ value: 'NaN', bitCount: 32 })).toEqual('01111111110000000000000000000000');
      expect(convertDecimalToBinary({ value: 'Infinity', bitCount: 32 })).toEqual('01111111100000000000000000000000');
      expect(convertDecimalToBinary({ value: '-Infinity', bitCount: 32 })).toEqual('11111111100000000000000000000000');
      expect(convertDecimalToBinary({ value: '2.5', bitCount: 32 })).toEqual('01000000001000000000000000000000');
      expect(convertDecimalToBinary({ value: '-128.25', bitCount: 32 })).toEqual('11000011000000000100000000000000');
      expect(convertDecimalToBinary({ value: '0.1', bitCount: 32 })).toEqual('00111101110011001100110011001101');
      expect(convertDecimalToBinary({ value: '3.4028235e38', bitCount: 32 })).toEqual('01111111011111111111111111111111');
      expect(convertDecimalToBinary({ value: '1.1754942e-38', bitCount: 32 })).toEqual('00000000011111111111111111111111');

      // 64-Bit
      expect(convertDecimalToBinary({ value: '0', bitCount: 64 })).toEqual('0000000000000000000000000000000000000000000000000000000000000000');
      expect(convertDecimalToBinary({ value: '-0', bitCount: 64 })).toEqual('1000000000000000000000000000000000000000000000000000000000000000');
      expect(convertDecimalToBinary({ value: 'NaN', bitCount: 64 })).toEqual('0111111111111000000000000000000000000000000000000000000000000000');
      expect(convertDecimalToBinary({ value: 'Infinity', bitCount: 64 })).toEqual('0111111111110000000000000000000000000000000000000000000000000000');
      expect(convertDecimalToBinary({ value: '-Infinity', bitCount: 64 })).toEqual('1111111111110000000000000000000000000000000000000000000000000000');
      expect(convertDecimalToBinary({ value: '2.5', bitCount: 64 })).toEqual('0100000000000100000000000000000000000000000000000000000000000000');
      expect(convertDecimalToBinary({ value: '-128.25', bitCount: 64 })).toEqual('1100000001100000000010000000000000000000000000000000000000000000');
      expect(convertDecimalToBinary({ value: '0.1', bitCount: 64 })).toEqual('0011111110111001100110011001100110011001100110011001100110011010');
      expect(convertDecimalToBinary({ value: '1.7976931348623157e308', bitCount: 64 })).toEqual('0111111111101111111111111111111111111111111111111111111111111111');
      expect(convertDecimalToBinary({ value: '2.225073858507201e-308', bitCount: 64 })).toEqual('0000000000001111111111111111111111111111111111111111111111111111');
    });
  });
  describe('convertBinaryToDecimal', () => {
    it('Should convert a floating point binary number (IEEE-754) to a decimal number', () => {
      // 32-Bit
      expect(convertBinaryToDecimal({ value: '00000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('0.00000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '10000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('-0.00000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '01111111110000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('NaN');
      expect(convertBinaryToDecimal({ value: '11111111110000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('NaN');
      expect(convertBinaryToDecimal({ value: '01111111110000000000000000000001', decimalPrecision: '32', removeZeroPadding: false })).toEqual('NaN');
      expect(convertBinaryToDecimal({ value: '01111111100000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('Infinity');
      expect(convertBinaryToDecimal({ value: '11111111100000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('-Infinity');
      expect(convertBinaryToDecimal({ value: '01000000001000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('2.50000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '01000000001000000000000000000000', decimalPrecision: '32', removeZeroPadding: true })).toEqual('2.5');
      expect(convertBinaryToDecimal({ value: '11000011000000000100000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('-128.25000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '00111101110011001100110011001101', decimalPrecision: '32', removeZeroPadding: false })).toEqual('0.10000000149011611938476562500000');
      expect(convertBinaryToDecimal({ value: '00111101110011001100110011001101', decimalPrecision: '10', removeZeroPadding: false })).toEqual('0.1000000015');
      expect(convertBinaryToDecimal({ value: '00111101110011001100110011001101', decimalPrecision: '1', removeZeroPadding: false })).toEqual('0.1');
      expect(convertBinaryToDecimal({ value: '01111111011111111111111111111111', decimalPrecision: '32', removeZeroPadding: false })).matches(/^3\.402823\d*e\+?38$/);
      expect(convertBinaryToDecimal({ value: '00000000011111111111111111111111', decimalPrecision: '32', removeZeroPadding: false })).toEqual('0.00000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '00000000011111111111111111111111', decimalPrecision: '64', removeZeroPadding: false })).toEqual('0.0000000000000000000000000000000000000117549421069244107548702944');
      expect(convertBinaryToDecimal({ value: '00000000011111111111111111111111', decimalPrecision: '', removeZeroPadding: false })).matches(/^1\.1754942\d*e-38$/);

      // 64-Bit
      expect(convertBinaryToDecimal({ value: '0000000000000000000000000000000000000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('0.00000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '1000000000000000000000000000000000000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('-0.00000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '0111111111111000000000000000000000000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('NaN');
      expect(convertBinaryToDecimal({ value: '1111111111111000000000000000000000000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('NaN');
      expect(convertBinaryToDecimal({ value: '0111111111111000000000000000000000000000000000000000000000000001', decimalPrecision: '32', removeZeroPadding: false })).toEqual('NaN');
      expect(convertBinaryToDecimal({ value: '0111111111110000000000000000000000000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('Infinity');
      expect(convertBinaryToDecimal({ value: '1111111111110000000000000000000000000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('-Infinity');
      expect(convertBinaryToDecimal({ value: '0100000000000100000000000000000000000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('2.50000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '0100000000000100000000000000000000000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: true })).toEqual('2.5');
      expect(convertBinaryToDecimal({ value: '1100000001100000000010000000000000000000000000000000000000000000', decimalPrecision: '32', removeZeroPadding: false })).toEqual('-128.25000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '0011111110111001100110011001100110011001100110011001100110011010', decimalPrecision: '32', removeZeroPadding: false })).toEqual('0.10000000000000000555111512312578');
      expect(convertBinaryToDecimal({ value: '0011111110111001100110011001100110011001100110011001100110011010', decimalPrecision: '10', removeZeroPadding: false })).toEqual('0.1000000000');
      expect(convertBinaryToDecimal({ value: '0011111110111001100110011001100110011001100110011001100110011010', decimalPrecision: '1', removeZeroPadding: false })).toEqual('0.1');
      expect(convertBinaryToDecimal({ value: '0111111111101111111111111111111111111111111111111111111111111111', decimalPrecision: '32', removeZeroPadding: false })).matches(/^1\.79769313\d*e\+?308$/);
      expect(convertBinaryToDecimal({ value: '0000000000001111111111111111111111111111111111111111111111111111', decimalPrecision: '32', removeZeroPadding: false })).toEqual('0.00000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '0000000000001111111111111111111111111111111111111111111111111111', decimalPrecision: '100', removeZeroPadding: false })).toEqual('0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
      expect(convertBinaryToDecimal({ value: '0000000000001111111111111111111111111111111111111111111111111111', decimalPrecision: '', removeZeroPadding: false })).matches(/^2\.2250738585\d*e-308$/);
    });
  });
});
