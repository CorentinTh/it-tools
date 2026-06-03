import type { Gender, GenerateOptions, GeneratedId, IdNumberStrategy } from '../national-id-generator.types';

// ─── types re-exported for backwards compatibility ────────────────────────────

export type { Gender };

export interface GenerateBelgianSSINOptions {
  birthYear?: number
  /** 1–12 */
  birthMonth?: number
  /** 1–31 */
  birthDay?: number
  gender?: Gender
  fictitious?: boolean
}

export interface BelgianSSIN extends GeneratedId {
  gender: Gender
  birthDate: Date
}

// ─── internal helpers ─────────────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysInMonth(year: number, month: number): number {
  // month is 1-indexed (1–12); new Date(year, month, 0) gives the last day of that month
  return new Date(year, month, 0).getDate();
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function randomLeapYear(min: number, max: number): number {
  const leapYears: number[] = [];
  for (let y = min; y <= max; y++) {
    if (isLeapYear(y)) {
      leapYears.push(y);
    }
  }
  return leapYears[Math.floor(Math.random() * leapYears.length)]!;
}

function computeChecksum(yymmdd: string, serial: string, bornAfter2000: boolean): string {
  const nineDigits = bornAfter2000 ? `2${yymmdd}${serial}` : `${yymmdd}${serial}`;
  const mod = BigInt(nineDigits) % 97n;
  const checksum = 97 - Number(mod);
  return checksum.toString().padStart(2, '0');
}

// ─── public API ───────────────────────────────────────────────────────────────

export function generateBelgianSSIN(opts: GenerateBelgianSSINOptions = {}): BelgianSSIN {
  const gender: Gender = opts.gender ?? (Math.random() < 0.5 ? 'male' : 'female');
  const fictitious = opts.fictitious ?? false;

  const currentYear = new Date().getFullYear();
  const needsLeapYear = opts.birthDay === 29 && opts.birthMonth === 2 && opts.birthYear === undefined;
  const fullYear = opts.birthYear ?? (needsLeapYear ? randomLeapYear(1900, currentYear) : randomInt(1900, currentYear));
  const month = opts.birthMonth ?? randomInt(1, 12);
  const day = opts.birthDay ?? randomInt(1, daysInMonth(fullYear, month));
  const birthDate = new Date(fullYear, month - 1, day);

  const yy = fullYear.toString().slice(-2).padStart(2, '0');
  const mm = month.toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');
  const yymmdd = `${yy}${mm}${dd}`;
  const bornAfter2000 = fullYear >= 2000;

  let serial: string;
  if (gender === 'male') {
    const minOdd = fictitious ? 901 : 1;
    const maxOdd = fictitious ? 999 : 899;
    const oddNum = randomInt(minOdd, maxOdd);
    const oddValue = oddNum % 2 === 0 ? oddNum + 1 : oddNum;
    serial = oddValue.toString().padStart(3, '0');
  }
  else {
    const minEven = fictitious ? 900 : 2;
    const maxEven = fictitious ? 998 : 898;
    const evenNum = randomInt(minEven / 2, maxEven / 2);
    serial = (evenNum * 2).toString().padStart(3, '0');
  }

  const checksum = computeChecksum(yymmdd, serial, bornAfter2000);
  const raw = `${yymmdd}${serial}${checksum}`;

  return { raw, formatted: formatBelgianSSIN(raw), gender, birthDate };
}

export function formatBelgianSSIN(ssin: string): string {
  return `${ssin.slice(0, 2)}.${ssin.slice(2, 4)}.${ssin.slice(4, 6)}-${ssin.slice(6, 9)}.${ssin.slice(9, 11)}`;
}

// ─── strategy object ──────────────────────────────────────────────────────────

export const belgianStrategy: IdNumberStrategy = {
  countryCode: 'be',
  label: 'Belgium',
  supportsBirthDate: true,
  supportsGender: true,
  supportsFictitious: true,

  generate(opts?: GenerateOptions): GeneratedId {
    const { raw, formatted } = generateBelgianSSIN(opts);
    return { raw, formatted };
  },
};
