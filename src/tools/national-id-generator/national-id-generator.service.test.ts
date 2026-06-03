import { describe, expect, it } from 'vitest';
import { formatBelgianSSIN, generateBelgianSSIN } from './national-id-generator.service';

describe('formatBelgianSSIN', () => {
  it('formats an 11-digit string as YY.MM.DD-SSS.CC', () => {
    expect(formatBelgianSSIN('85073100145')).toBe('85.07.31-001.45');
  });
});

describe('generateBelgianSSIN — checksum validation', () => {
  // Known valid Belgian SSINs (pre-2000 and post-2000)
  // Formula: checksum = 97 − (YYMMDDSS mod 97)  [pre-2000]
  //          checksum = 97 − (2YYMMDDSS mod 97)  [post-2000]

  it('validates a known pre-2000 SSIN: 85.07.31-001.30', () => {
    // 850731001 mod 97 = 67  → checksum = 30
    const mod = BigInt('850731001') % 97n;
    expect(97 - Number(mod)).toBe(30);
    expect(formatBelgianSSIN('85073100130')).toBe('85.07.31-001.30');
  });

  it('validates a second known pre-2000 SSIN: 75.03.15-002.77', () => {
    // 750315002 mod 97 = 20 → checksum = 77
    const mod = BigInt('750315002') % 97n;
    expect(97 - Number(mod)).toBe(77);
  });

  it('validates a known post-2000 SSIN (2-prefix): 01.09.20-003.XX', () => {
    // 2010920003 mod 97 → checksum
    const result = generateBelgianSSIN({
      birthYear: 2001,
      birthMonth: 9,
      birthDay: 20,
      gender: 'male',
    });
    // Verify the generated checksum is correct
    const serial = result.raw.slice(6, 9);
    const computedMod = BigInt(`2${result.raw.slice(0, 6)}${serial}`) % 97n;
    const computedChecksum = 97 - Number(computedMod);
    expect(Number(result.raw.slice(9, 11))).toBe(computedChecksum);
  });
});

describe('generateBelgianSSIN — gender / serial parity', () => {
  it('male generates odd serial', () => {
    for (let i = 0; i < 20; i++) {
      const { raw } = generateBelgianSSIN({ gender: 'male' });
      const serial = Number(raw.slice(6, 9));
      expect(serial % 2).toBe(1);
    }
  });

  it('female generates even serial', () => {
    for (let i = 0; i < 20; i++) {
      const { raw } = generateBelgianSSIN({ gender: 'female' });
      const serial = Number(raw.slice(6, 9));
      expect(serial % 2).toBe(0);
    }
  });
});

describe('generateBelgianSSIN — fictitious flag', () => {
  it('non-fictitious male serial is in low range (1–899 odd)', () => {
    for (let i = 0; i < 20; i++) {
      const { raw } = generateBelgianSSIN({ gender: 'male', fictitious: false });
      const serial = Number(raw.slice(6, 9));
      expect(serial).toBeGreaterThanOrEqual(1);
      expect(serial).toBeLessThanOrEqual(899);
      expect(serial % 2).toBe(1);
    }
  });

  it('fictitious male serial is in high range (901–999 odd)', () => {
    for (let i = 0; i < 20; i++) {
      const { raw } = generateBelgianSSIN({ gender: 'male', fictitious: true });
      const serial = Number(raw.slice(6, 9));
      expect(serial).toBeGreaterThanOrEqual(901);
      expect(serial).toBeLessThanOrEqual(999);
      expect(serial % 2).toBe(1);
    }
  });

  it('fictitious female serial is in high range (900–998 even)', () => {
    for (let i = 0; i < 20; i++) {
      const { raw } = generateBelgianSSIN({ gender: 'female', fictitious: true });
      const serial = Number(raw.slice(6, 9));
      expect(serial).toBeGreaterThanOrEqual(900);
      expect(serial).toBeLessThanOrEqual(998);
      expect(serial % 2).toBe(0);
    }
  });
});

describe('generateBelgianSSIN — checksum integrity', () => {
  it('generated SSIN always has a valid checksum (pre-2000)', () => {
    for (let i = 0; i < 30; i++) {
      const result = generateBelgianSSIN({ birthYear: 1985, birthMonth: 1, birthDay: 1 });
      const nineDigits = result.raw.slice(0, 9);
      const cc = Number(result.raw.slice(9, 11));
      const mod = BigInt(nineDigits) % 97n;
      expect(97 - Number(mod)).toBe(cc);
    }
  });

  it('generated SSIN always has a valid checksum (post-2000)', () => {
    for (let i = 0; i < 30; i++) {
      const result = generateBelgianSSIN({ birthYear: 2003, birthMonth: 6, birthDay: 15 });
      const nineDigits = `2${result.raw.slice(0, 9)}`;
      const cc = Number(result.raw.slice(9, 11));
      const mod = BigInt(nineDigits) % 97n;
      expect(97 - Number(mod)).toBe(cc);
    }
  });
});

describe('generateBelgianSSIN — date field options', () => {
  it('encodes a fully-specified pre-2000 birth date in the raw output', () => {
    const { raw, birthDate } = generateBelgianSSIN({ birthYear: 1992, birthMonth: 3, birthDay: 14 });
    expect(raw.slice(0, 2)).toBe('92');
    expect(raw.slice(2, 4)).toBe('03');
    expect(raw.slice(4, 6)).toBe('14');
    expect(birthDate.getFullYear()).toBe(1992);
    expect(birthDate.getMonth()).toBe(2); // 0-indexed
    expect(birthDate.getDate()).toBe(14);
  });

  it('encodes a fully-specified post-2000 birth date in the raw output', () => {
    const { raw, birthDate } = generateBelgianSSIN({ birthYear: 2010, birthMonth: 11, birthDay: 5 });
    expect(raw.slice(0, 2)).toBe('10');
    expect(raw.slice(2, 4)).toBe('11');
    expect(raw.slice(4, 6)).toBe('05');
    expect(birthDate.getFullYear()).toBe(2010);
    expect(birthDate.getMonth()).toBe(10); // 0-indexed
    expect(birthDate.getDate()).toBe(5);
  });

  it('respects birthYear when provided alone, randomises month and day', () => {
    for (let i = 0; i < 10; i++) {
      const { raw } = generateBelgianSSIN({ birthYear: 1978 });
      expect(raw.slice(0, 2)).toBe('78');
      expect(Number(raw.slice(2, 4))).toBeGreaterThanOrEqual(1);
      expect(Number(raw.slice(2, 4))).toBeLessThanOrEqual(12);
      expect(Number(raw.slice(4, 6))).toBeGreaterThanOrEqual(1);
    }
  });

  it('respects birthMonth when provided alone', () => {
    for (let i = 0; i < 10; i++) {
      const { raw } = generateBelgianSSIN({ birthMonth: 7 });
      expect(raw.slice(2, 4)).toBe('07');
    }
  });

  it('respects birthDay when provided alone', () => {
    for (let i = 0; i < 10; i++) {
      const { raw } = generateBelgianSSIN({ birthDay: 15 });
      expect(raw.slice(4, 6)).toBe('15');
    }
  });

  it('respects birthYear and birthMonth together, randomises day within the month', () => {
    for (let i = 0; i < 10; i++) {
      const { raw } = generateBelgianSSIN({ birthYear: 1965, birthMonth: 4 });
      expect(raw.slice(0, 2)).toBe('65');
      expect(raw.slice(2, 4)).toBe('04');
      const day = Number(raw.slice(4, 6));
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(30); // April has 30 days
    }
  });

  it('respects birthMonth and birthDay together, randomises year', () => {
    for (let i = 0; i < 10; i++) {
      const { raw } = generateBelgianSSIN({ birthMonth: 6, birthDay: 20 });
      expect(raw.slice(2, 4)).toBe('06');
      expect(raw.slice(4, 6)).toBe('20');
    }
  });

  it('picks a leap year when Feb 29 is requested without a year', () => {
    for (let i = 0; i < 10; i++) {
      const { raw, birthDate } = generateBelgianSSIN({ birthMonth: 2, birthDay: 29 });
      expect(raw.slice(2, 4)).toBe('02');
      expect(raw.slice(4, 6)).toBe('29');
      const year = birthDate.getFullYear();
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      expect(isLeap).toBe(true);
    }
  });

  it('encodes Feb 29 with an explicit leap year correctly', () => {
    const { raw, birthDate } = generateBelgianSSIN({ birthYear: 2000, birthMonth: 2, birthDay: 29 });
    expect(raw.slice(0, 2)).toBe('00');
    expect(raw.slice(2, 4)).toBe('02');
    expect(raw.slice(4, 6)).toBe('29');
    expect(birthDate.getFullYear()).toBe(2000);
    expect(birthDate.getMonth()).toBe(1); // 0-indexed
    expect(birthDate.getDate()).toBe(29);
  });

  it('raw output is always exactly 11 digits', () => {
    for (let i = 0; i < 20; i++) {
      const { raw } = generateBelgianSSIN();
      expect(raw).toMatch(/^\d{11}$/);
    }
  });
});

describe('generateBelgianSSIN — fictitious flag (non-fictitious female)', () => {
  it('non-fictitious female serial is in low range (2–898 even)', () => {
    for (let i = 0; i < 20; i++) {
      const { raw } = generateBelgianSSIN({ gender: 'female', fictitious: false });
      const serial = Number(raw.slice(6, 9));
      expect(serial).toBeGreaterThanOrEqual(2);
      expect(serial).toBeLessThanOrEqual(898);
      expect(serial % 2).toBe(0);
    }
  });
});
