export type StorageUnit
  = | 'bit'
    | 'byte'
    | 'kilobit'
    | 'kilobyte'
    | 'megabit'
    | 'megabyte'
    | 'gigabit'
    | 'gigabyte'
    | 'terabit'
    | 'terabyte'
    | 'petabit'
    | 'petabyte'
    | 'kibibit'
    | 'kibibyte'
    | 'mebibit'
    | 'mebibyte'
    | 'gibibit'
    | 'gibibyte'
    | 'tebibit'
    | 'tebibyte'
    | 'pebibit'
    | 'pebibyte';

const BITS_PER_BYTE = 8;

// Decimal (SI) prefixes: powers of 1000
const SI_PREFIXES: Partial<Record<StorageUnit, number>> = {
  kilobit: 1e3,
  kilobyte: 1e3,
  megabit: 1e6,
  megabyte: 1e6,
  gigabit: 1e9,
  gigabyte: 1e9,
  terabit: 1e12,
  terabyte: 1e12,
  petabit: 1e15,
  petabyte: 1e15,
};

// Binary (IEC) prefixes: powers of 1024
const IEC_PREFIXES: Partial<Record<StorageUnit, number>> = {
  kibibit: 1024,
  kibibyte: 1024,
  mebibit: 1024 ** 2,
  mebibyte: 1024 ** 2,
  gibibit: 1024 ** 3,
  gibibyte: 1024 ** 3,
  tebibit: 1024 ** 4,
  tebibyte: 1024 ** 4,
  pebibit: 1024 ** 5,
  pebibyte: 1024 ** 5,
};

export function unitToBits(value: number, unit: StorageUnit): number {
  let bits: number;

  switch (unit) {
    case 'bit':
      bits = value;
      break;
    case 'byte':
      bits = value * BITS_PER_BYTE;
      break;
    default: {
      const factor = SI_PREFIXES[unit] ?? IEC_PREFIXES[unit] ?? 1;
      bits = unit.endsWith('bit') ? value * factor : value * factor * BITS_PER_BYTE;
      break;
    }
  }

  return bits;
}

export function bitsToUnit(bits: number, unit: StorageUnit): number {
  let value: number;

  switch (unit) {
    case 'bit':
      value = bits;
      break;
    case 'byte':
      value = bits / BITS_PER_BYTE;
      break;
    default: {
      const factor = SI_PREFIXES[unit] ?? IEC_PREFIXES[unit] ?? 1;
      value = unit.endsWith('bit') ? bits / factor : bits / factor / BITS_PER_BYTE;
      break;
    }
  }

  return value;
}

export function formatPrecision(value: number): string {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return String(value);
  }

  if (value === 0) {
    return '0';
  }

  const abs = Math.abs(value);

  // Use full double precision (up to 12 decimal places), trimming trailing zeros
  const digits = Math.max(0, 12 - Math.max(0, Math.floor(Math.log10(abs))) - 1);
  return String(Number(value.toFixed(Math.min(digits, 12))));
}
