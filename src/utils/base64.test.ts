import { describe, expect, it } from 'vitest';
import { base64ToText, isValidBase64, removePotentialDataAndMimePrefix, textToBase64 } from './base64';

describe('base64 utils', () => {
  describe('textToBase64', () => {
    it('should convert string into base64', () => {
      expect(textToBase64('')).to.eql('');
      expect(textToBase64('a')).to.eql('YQ==');
      expect(textToBase64('lorem ipsum')).to.eql('bG9yZW0gaXBzdW0=');
      expect(textToBase64('-1')).to.eql('LTE=');
      expect(textToBase64('<<<????????>>>', { makeUrlSafe: false })).to.eql('PDw8Pz8/Pz8/Pz8+Pj4=');
    });
    it('should convert string into url safe base64', () => {
      expect(textToBase64('', { makeUrlSafe: true })).to.eql('');
      expect(textToBase64('a', { makeUrlSafe: true })).to.eql('YQ');
      expect(textToBase64('lorem ipsum', { makeUrlSafe: true })).to.eql('bG9yZW0gaXBzdW0');
      expect(textToBase64('<<<????????>>>', { makeUrlSafe: true })).to.eql('PDw8Pz8_Pz8_Pz8-Pj4');
    });
  });

  describe('base64ToText', () => {
    it('should convert base64 into text', () => {
      expect(base64ToText('')).to.eql('');
      expect(base64ToText('YQ==', { makeUrlSafe: false })).to.eql('a');
      expect(base64ToText('bG9yZW0gaXBzdW0=')).to.eql('lorem ipsum');
      expect(base64ToText('data:text/plain;base64,bG9yZW0gaXBzdW0=')).to.eql('lorem ipsum');
      expect(base64ToText('LTE=')).to.eql('-1');
    });

    it('should convert url safe base64 into text', () => {
      expect(base64ToText('', { makeUrlSafe: true })).to.eql('');
      expect(base64ToText('YQ', { makeUrlSafe: true })).to.eql('a');
      expect(base64ToText('bG9yZW0gaXBzdW0', { makeUrlSafe: true })).to.eql('lorem ipsum');
      expect(base64ToText('data:text/plain;base64,bG9yZW0gaXBzdW0', { makeUrlSafe: true })).to.eql('lorem ipsum');
      expect(base64ToText('LTE', { makeUrlSafe: true })).to.eql('-1');
      expect(base64ToText('PDw8Pz8_Pz8_Pz8-Pj4', { makeUrlSafe: true })).to.eql('<<<????????>>>');
    });

    it('should throw for incorrect base64 string', () => {
      expect(() => base64ToText('a')).to.throw('Incorrect base64 string');
      expect(() => base64ToText(' ')).to.throw('Incorrect base64 string');
      expect(() => base64ToText('é')).to.throw('Incorrect base64 string');
      // missing final '='
      expect(() => base64ToText('bG9yZW0gaXBzdW0')).to.throw('Incorrect base64 string');
    });
  });

  describe('isValidBase64', () => {
    it('should return true for correct base64 string', () => {
      expect(isValidBase64('')).to.eql(true);
      expect(isValidBase64('bG9yZW0gaXBzdW0=')).to.eql(true);
      expect(isValidBase64('LTE=')).to.eql(true);
      expect(isValidBase64('YQ==')).to.eql(true);
      expect(isValidBase64('data:text/plain;base64,YQ==')).to.eql(true);
    });

    it('should return false for incorrect base64 string', () => {
      expect(isValidBase64('a')).to.eql(false);
      expect(isValidBase64(' ')).to.eql(false);
      expect(isValidBase64('é')).to.eql(false);
      expect(isValidBase64('data:text/plain;notbase64,YQ==')).to.eql(false);
      // missing final '='
      expect(isValidBase64('bG9yZW0gaXBzdW0')).to.eql(false);
    });

    it('should return false for untrimmed correct base64 string', () => {
      expect(isValidBase64('bG9yZW0gaXBzdW0= ')).to.eql(false);
      expect(isValidBase64(' LTE=')).to.eql(false);
      expect(isValidBase64(' YQ== ')).to.eql(false);
    });
  });

  describe('removePotentialDataAndMimePrefix', () => {
    it('should remove data prefix of string', () => {
      expect(removePotentialDataAndMimePrefix('')).to.eql('');
      expect(removePotentialDataAndMimePrefix('lorem ipsum')).to.eql('lorem ipsum');
      expect(removePotentialDataAndMimePrefix('bG9yZW0gaXBzdW0=')).to.eql('bG9yZW0gaXBzdW0=');
      expect(removePotentialDataAndMimePrefix('data:image/jpeg;base64,lorem')).to.eql('lorem');
      expect(removePotentialDataAndMimePrefix('data:image/jpeg;notbase64,lorem')).to.eql(
        'data:image/jpeg;notbase64,lorem',
      );
      expect(removePotentialDataAndMimePrefix('data:unknownmime;base64,lorem')).to.eql('lorem');
    });
  });
});
