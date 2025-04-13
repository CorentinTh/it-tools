import { describe, expect, it } from 'vitest';
import {
  checkSymbolicString, computeChmodOctalRepresentation, computeChmodSymbolicRepresentation, symbolicToOctal,
} from './chmod-calculator.service';

describe('chmod-calculator', () => {
  describe('computeChmodOctalRepresentation', () => {
    it('get the octal representation from permissions', () => {
      expect(
        computeChmodOctalRepresentation({
          permissions: {
            owner: { read: true, write: true, execute: true },
            group: { read: true, write: true, execute: true },
            public: { read: true, write: true, execute: true },
          },
        }),
      ).to.eql('777');

      expect(
        computeChmodOctalRepresentation({
          permissions: {
            owner: { read: false, write: false, execute: false },
            group: { read: false, write: false, execute: false },
            public: { read: false, write: false, execute: false },
          },
        }),
      ).to.eql('000');

      expect(
        computeChmodOctalRepresentation({
          permissions: {
            owner: { read: false, write: true, execute: false },
            group: { read: false, write: true, execute: true },
            public: { read: true, write: false, execute: true },
          },
        }),
      ).to.eql('235');

      expect(
        computeChmodOctalRepresentation({
          permissions: {
            owner: { read: true, write: false, execute: false },
            group: { read: false, write: true, execute: false },
            public: { read: false, write: false, execute: true },
          },
        }),
      ).to.eql('421');

      expect(
        computeChmodOctalRepresentation({
          permissions: {
            owner: { read: false, write: false, execute: true },
            group: { read: false, write: true, execute: false },
            public: { read: true, write: false, execute: false },
          },
        }),
      ).to.eql('124');

      expect(
        computeChmodOctalRepresentation({
          permissions: {
            owner: { read: false, write: true, execute: false },
            group: { read: false, write: true, execute: false },
            public: { read: false, write: true, execute: false },
          },
        }),
      ).to.eql('222');
    });

    it('get the symbolic representation from permissions', () => {
      expect(
        computeChmodSymbolicRepresentation({
          permissions: {
            owner: { read: true, write: true, execute: true },
            group: { read: true, write: true, execute: true },
            public: { read: true, write: true, execute: true },
          },
        }),
      ).to.eql('rwxrwxrwx');

      expect(
        computeChmodSymbolicRepresentation({
          permissions: {
            owner: { read: false, write: false, execute: false },
            group: { read: false, write: false, execute: false },
            public: { read: false, write: false, execute: false },
          },
        }),
      ).to.eql('---------');

      expect(
        computeChmodSymbolicRepresentation({
          permissions: {
            owner: { read: false, write: true, execute: false },
            group: { read: false, write: true, execute: true },
            public: { read: true, write: false, execute: true },
          },
        }),
      ).to.eql('-w--wxr-x');

      expect(
        computeChmodSymbolicRepresentation({
          permissions: {
            owner: { read: true, write: false, execute: false },
            group: { read: false, write: true, execute: false },
            public: { read: false, write: false, execute: true },
          },
        }),
      ).to.eql('r---w---x');

      expect(
        computeChmodSymbolicRepresentation({
          permissions: {
            owner: { read: false, write: false, execute: true },
            group: { read: false, write: true, execute: false },
            public: { read: true, write: false, execute: false },
          },
        }),
      ).to.eql('--x-w-r--');

      expect(
        computeChmodSymbolicRepresentation({
          permissions: {
            owner: { read: false, write: true, execute: false },
            group: { read: false, write: true, execute: false },
            public: { read: false, write: true, execute: false },
          },
        }),
      ).to.eql('-w--w--w-');
    });
  });
  describe('symbolicToNumeric', () => {
    it('should return the correct octal value for symbolic strings', () => {
      expect(symbolicToOctal('rwxrwxrwx')).toBe(777);
      expect(symbolicToOctal('drwxrwxrwx')).toBe(777);
      expect(symbolicToOctal('-rwxrwxrwx')).toBe(777);
      expect(symbolicToOctal('lrwxrwxrwx')).toBe(777);

      expect(symbolicToOctal('rwxr-xr-x')).toBe(755);
      expect(symbolicToOctal('drwxr-xr-x')).toBe(755);
      expect(symbolicToOctal('-rwxr-xr-x')).toBe(755);
      expect(symbolicToOctal('lrwxr-xr-x')).toBe(755);

      expect(symbolicToOctal('rwxrwxr-x')).toBe(775);
      expect(symbolicToOctal('drwxrwxr-x')).toBe(775);
      expect(symbolicToOctal('-rwxrwxr-x')).toBe(775);
      expect(symbolicToOctal('lrwxrwxr-x')).toBe(775);

      expect(symbolicToOctal('rw-r--r--')).toBe(644);
      expect(symbolicToOctal('drw-r--r--')).toBe(644);
      expect(symbolicToOctal('-rw-r--r--')).toBe(644);
      expect(symbolicToOctal('lrw-r--r--')).toBe(644);

      expect(symbolicToOctal('rw-------')).toBe(600);
      expect(symbolicToOctal('drw-------')).toBe(600);
      expect(symbolicToOctal('-rw-------')).toBe(600);
      expect(symbolicToOctal('lrw-------')).toBe(600);

      expect(symbolicToOctal('rwx------')).toBe(700);
      expect(symbolicToOctal('drwx------')).toBe(700);
      expect(symbolicToOctal('-rwx------')).toBe(700);
      expect(symbolicToOctal('lrwx------')).toBe(700);

      expect(symbolicToOctal('rw-rw-rw-')).toBe(666);
      expect(symbolicToOctal('drw-rw-rw-')).toBe(666);
      expect(symbolicToOctal('-rw-rw-rw-')).toBe(666);
      expect(symbolicToOctal('lrw-rw-rw-')).toBe(666);

      expect(symbolicToOctal('r--------')).toBe(400);
      expect(symbolicToOctal('dr--------')).toBe(400);
      expect(symbolicToOctal('-r--------')).toBe(400);
      expect(symbolicToOctal('lr--------')).toBe(400);

      expect(symbolicToOctal('rw-rw-r--')).toBe(664);
      expect(symbolicToOctal('drw-rw-r--')).toBe(664);
      expect(symbolicToOctal('-rw-rw-r--')).toBe(664);
      expect(symbolicToOctal('lrw-rw-r--')).toBe(664);

      expect(symbolicToOctal('rwxr--r--')).toBe(744);
      expect(symbolicToOctal('drwxr--r--')).toBe(744);
      expect(symbolicToOctal('-rwxr--r--')).toBe(744);
      expect(symbolicToOctal('lrwxr--r--')).toBe(744);

      expect(symbolicToOctal('rwxrwx---')).toBe(770);
      expect(symbolicToOctal('drwxrwx---')).toBe(770);
      expect(symbolicToOctal('-rwxrwx---')).toBe(770);
      expect(symbolicToOctal('lrwxrwx---')).toBe(770);

      expect(symbolicToOctal('r--r--r--')).toBe(444);
      expect(symbolicToOctal('dr--r--r--')).toBe(444);
      expect(symbolicToOctal('-r--r--r--')).toBe(444);
      expect(symbolicToOctal('lr--r--r--')).toBe(444);

      expect(symbolicToOctal('r-xr-xr-x')).toBe(555);
      expect(symbolicToOctal('dr-xr-xr-x')).toBe(555);
      expect(symbolicToOctal('-r-xr-xr-x')).toBe(555);
      expect(symbolicToOctal('lr-xr-xr-x')).toBe(555);

      expect(symbolicToOctal('---------')).toBe(0o00);
      expect(symbolicToOctal('d---------')).toBe(0o00);
      expect(symbolicToOctal('----------')).toBe(0o00);
      expect(symbolicToOctal('l---------')).toBe(0o00);
    });
  });

  describe('validateSymbolicInput', () => {
    it('should return a non-empty error message for invalid duplicate entity permissions', () => {
      expect(checkSymbolicString('rrwrwxrwx')).not.toBe('');
      expect(checkSymbolicString('drrwrwxrwx')).not.toBe('');
      expect(checkSymbolicString('-rrwrwxrwx')).not.toBe('');
      expect(checkSymbolicString('lrrwrwxrwx')).not.toBe('');

      expect(checkSymbolicString('rrwxrwxrw')).not.toBe('');
      expect(checkSymbolicString('drrwxrwxrw')).not.toBe('');
      expect(checkSymbolicString('-rrwxrwxrw')).not.toBe('');
      expect(checkSymbolicString('lrrwxrwxrw')).not.toBe('');

      expect(checkSymbolicString('rwrwrrxwx')).not.toBe('');
      expect(checkSymbolicString('drwrwrrxwx')).not.toBe('');
      expect(checkSymbolicString('-rwrwrrxwx')).not.toBe('');
      expect(checkSymbolicString('lwrwrrxwx')).not.toBe('');

      expect(checkSymbolicString('rwrwxrrwx')).not.toBe('');
      expect(checkSymbolicString('drwrwxrrwx')).not.toBe('');
      expect(checkSymbolicString('-rwrwxrrwx')).not.toBe('');
      expect(checkSymbolicString('lrwrwxrrwx')).not.toBe('');

      expect(checkSymbolicString('rwxrrwrwx')).not.toBe('');
      expect(checkSymbolicString('drwxrrwrwx')).not.toBe('');
      expect(checkSymbolicString('-rwxrrwrwx')).not.toBe('');
      expect(checkSymbolicString('lwxrrwrwx')).not.toBe('');

      expect(checkSymbolicString('rwxrwrwrx')).not.toBe('');
      expect(checkSymbolicString('drwxrwrwrx')).not.toBe('');
      expect(checkSymbolicString('-rwxrwrwrx')).not.toBe('');
      expect(checkSymbolicString('lwxrwrwrx')).not.toBe('');

      expect(checkSymbolicString('rrwrwrwxw')).not.toBe('');
      expect(checkSymbolicString('drrwrwrwxw')).not.toBe('');
      expect(checkSymbolicString('-rrwrwrwxw')).not.toBe('');
      expect(checkSymbolicString('lrrwrwrwxw')).not.toBe('');

      expect(checkSymbolicString('rrwxwrrwx')).not.toBe('');
      expect(checkSymbolicString('drrwxwrrwx')).not.toBe('');
      expect(checkSymbolicString('-rrwxwrrwx')).not.toBe('');
      expect(checkSymbolicString('lrrwxwrrwx')).not.toBe('');

      expect(checkSymbolicString('rwrwrrwxr')).not.toBe('');
      expect(checkSymbolicString('drwrwrrwxr')).not.toBe('');
      expect(checkSymbolicString('-rwrwrrwxr')).not.toBe('');
      expect(checkSymbolicString('lwrwrrwxr')).not.toBe('');

      expect(checkSymbolicString('rwrwxrwrw')).not.toBe('');
      expect(checkSymbolicString('drwrwxrwrw')).not.toBe('');
      expect(checkSymbolicString('-rwrwxrwrw')).not.toBe('');
      expect(checkSymbolicString('lwrwxrwrw')).not.toBe('');

      expect(checkSymbolicString('rwxrrwxrw')).not.toBe('');
      expect(checkSymbolicString('drwxrrwxrw')).not.toBe('');
      expect(checkSymbolicString('-rwxrrwxrw')).not.toBe('');
      expect(checkSymbolicString('lrwxrrwxrw')).not.toBe('');

      expect(checkSymbolicString('rww--rwrw-')).not.toBe('');
      expect(checkSymbolicString('drww--rwrw-')).not.toBe('');
      expect(checkSymbolicString('-rww--rwrw-')).not.toBe('');
      expect(checkSymbolicString('lrww--rwrw-')).not.toBe('');

      expect(checkSymbolicString('r--wrrwxr')).not.toBe('');
      expect(checkSymbolicString('dr--wrrwxr')).not.toBe('');
      expect(checkSymbolicString('-r--wrrwxr')).not.toBe('');
      expect(checkSymbolicString('lr--wrrwxr')).not.toBe('');

      expect(checkSymbolicString('rw--rrwxr-')).not.toBe('');
      expect(checkSymbolicString('drw--rrwxr-')).not.toBe('');
      expect(checkSymbolicString('-rw--rrwxr-')).not.toBe('');
      expect(checkSymbolicString('lrw--rrwxr-')).not.toBe('');
    });
  });
  describe('validateSymbolicInput', () => {
    describe('validateOrder', () => {
      it('should correctly validate the order of permissions', () => {
        expect(checkSymbolicString('-rwxrwxrwx')).toBe('');
        expect(checkSymbolicString('drwxrwxrwx')).toBe('');
        expect(checkSymbolicString('lrwxrwxrwx')).toBe('');
        expect(checkSymbolicString('brwxrwxrwx')).toBe('');
        expect(checkSymbolicString('crwxrwxrwx')).toBe('');
        expect(checkSymbolicString('srwxrwxrwx')).toBe('');
        expect(checkSymbolicString('prwxrwxrwx')).toBe('');

        expect(checkSymbolicString('rwxrwxrwx')).toBe('');
        expect(checkSymbolicString('rw-r--r--')).toBe('');
        expect(checkSymbolicString('r-xr-xr-x')).toBe('');
        expect(checkSymbolicString('-wxrw-r-x')).toBe('');
        expect(checkSymbolicString('rwxrw-r-x')).toBe('');
        expect(checkSymbolicString('rwxr-xrw-')).toBe('');
        expect(checkSymbolicString('rwxr-xrw-')).toBe('');
        expect(checkSymbolicString('rxwr-xrw-')).toBe('User permissions should be in the order of \'r\', \'w\', \'x\'.');
        expect(checkSymbolicString('rwxr-wrw-')).toBe('Group permissions should be in the order of \'r\', \'w\', \'x\'.');
        expect(checkSymbolicString('rwxr-xr-w')).toBe('Public permissions should be in the order of \'r\', \'w\', \'x\'.');
      });
    });
  });
});
