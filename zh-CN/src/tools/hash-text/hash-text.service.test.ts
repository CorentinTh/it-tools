import { describe, expect, it } from 'vitest';
import { convertHexToBin } from './hash-text.service';

describe('hash text', () => {
  describe('convertHexToBin', () => {
    it('convert hex to bin', () => {
      expect(convertHexToBin('')).toEqual('');
      expect(convertHexToBin('FF')).toEqual('11111111');
      expect(convertHexToBin('F'.repeat(200))).toEqual('1111'.repeat(200));
      expect(convertHexToBin('2123006AD00F694CE120')).toEqual(
        '00100001001000110000000001101010110100000000111101101001010011001110000100100000',
      );
    });
  });
});
