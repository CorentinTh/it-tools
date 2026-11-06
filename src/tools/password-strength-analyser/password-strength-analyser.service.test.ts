import { describe, expect, it } from 'vitest';
import { getCharsetLength } from './password-strength-analyser.service';

describe('password-strength-analyser-and-crack-time-estimation', () => {
  describe('getCharsetLength', () => {
    describe('computes the charset length of a given password', () => {
      it('the charset length is 26 when the password is only lowercase characters', () => {
        expect(getCharsetLength({ password: 'abcdefghijklmnopqrstuvwxyz' })).toBe(26);
      });
      it('the charset length is 26 when the password is only uppercase characters', () => {
        expect(getCharsetLength({ password: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' })).toBe(26);
      });
      it('the charset length is 10 when the password is only digits', () => {
        expect(getCharsetLength({ password: '0123456789' })).toBe(10);
      });
      it('the charset length is 32 when the password is only special characters', () => {
        expect(getCharsetLength({ password: '-_(' })).toBe(32);
      });
      it('the charset length is 0 when the password is empty', () => {
        expect(getCharsetLength({ password: '' })).toBe(0);
      });

      it('the charset length is 36 when the password is lowercase characters and digits', () => {
        expect(getCharsetLength({ password: 'abcdefghijklmnopqrstuvwxyz0123456789' })).toBe(36);
      });
      it('the charset length is 95 when the password is lowercase characters, uppercase characters, digits and special characters', () => {
        expect(getCharsetLength({ password: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_(' })).toBe(94);
      });
    });
  });
});
