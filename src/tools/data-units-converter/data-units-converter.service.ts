export interface DataUnit {
  id: string
  label: string
  bits: bigint
}

export interface DataConversion {
  value: string
  exact: boolean
  fraction: string
}

export const DATA_UNITS: DataUnit[] = [
  { id: 'bit', label: 'bit', bits: 1n },
  { id: 'B', label: 'byte (B)', bits: 8n },
  { id: 'kbit', label: 'kilobit (kbit, 10³ bits)', bits: 1_000n },
  { id: 'kB', label: 'kilobyte (kB, 10³ bytes)', bits: 8_000n },
  { id: 'Mbit', label: 'megabit (Mbit, 10⁶ bits)', bits: 1_000_000n },
  { id: 'MB', label: 'megabyte (MB, 10⁶ bytes)', bits: 8_000_000n },
  { id: 'Gbit', label: 'gigabit (Gbit, 10⁹ bits)', bits: 1_000_000_000n },
  { id: 'GB', label: 'gigabyte (GB, 10⁹ bytes)', bits: 8_000_000_000n },
  { id: 'Tbit', label: 'terabit (Tbit, 10¹² bits)', bits: 1_000_000_000_000n },
  { id: 'TB', label: 'terabyte (TB, 10¹² bytes)', bits: 8_000_000_000_000n },
  { id: 'Pbit', label: 'petabit (Pbit, 10¹⁵ bits)', bits: 1_000_000_000_000_000n },
  { id: 'PB', label: 'petabyte (PB, 10¹⁵ bytes)', bits: 8_000_000_000_000_000n },
  { id: 'Kibit', label: 'kibibit (Kibit, 2¹⁰ bits)', bits: 1_024n },
  { id: 'KiB', label: 'kibibyte (KiB, 2¹⁰ bytes)', bits: 8_192n },
  { id: 'Mibit', label: 'mebibit (Mibit, 2²⁰ bits)', bits: 1_048_576n },
  { id: 'MiB', label: 'mebibyte (MiB, 2²⁰ bytes)', bits: 8_388_608n },
  { id: 'Gibit', label: 'gibibit (Gibit, 2³⁰ bits)', bits: 1_073_741_824n },
  { id: 'GiB', label: 'gibibyte (GiB, 2³⁰ bytes)', bits: 8_589_934_592n },
  { id: 'Tibit', label: 'tebibit (Tibit, 2⁴⁰ bits)', bits: 1_099_511_627_776n },
  { id: 'TiB', label: 'tebibyte (TiB, 2⁴⁰ bytes)', bits: 8_796_093_022_208n },
  { id: 'Pibit', label: 'pebibit (Pibit, 2⁵⁰ bits)', bits: 1_125_899_906_842_624n },
  { id: 'PiB', label: 'pebibyte (PiB, 2⁵⁰ bytes)', bits: 9_007_199_254_740_992n },
];

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
  const divisor = gcd(value.numerator, value.denominator);
  return { numerator: value.numerator / divisor, denominator: value.denominator / divisor };
}

function parseDecimal(source: string): Rational {
  const match = /^(\d{1,36})(?:\.(\d{1,18}))?$/u.exec(source.trim());
  if (!match) {
    throw new TypeError('Enter a non-negative decimal with at most 36 integer and 18 fractional digits.');
  }
  const fraction = match[2] ?? '';
  return reduce({ numerator: BigInt(`${match[1]}${fraction}`), denominator: 10n ** BigInt(fraction.length) });
}

function unit(id: string): DataUnit {
  const found = DATA_UNITS.find(candidate => candidate.id === id);
  if (!found) {
    throw new TypeError('Select a supported data unit.');
  }
  return found;
}

function formatRational(value: Rational, maximumFractionDigits = 60): DataConversion {
  const reduced = reduce(value);
  const integer = reduced.numerator / reduced.denominator;
  let remainder = reduced.numerator % reduced.denominator;
  if (remainder === 0n) {
    return { value: integer.toString(), exact: true, fraction: `${reduced.numerator}/${reduced.denominator}` };
  }
  let fraction = '';
  for (let index = 0; index < maximumFractionDigits && remainder !== 0n; index += 1) {
    remainder *= 10n;
    fraction += (remainder / reduced.denominator).toString();
    remainder %= reduced.denominator;
  }
  return {
    value: `${integer}.${fraction}${remainder === 0n ? '' : '…'}`,
    exact: remainder === 0n,
    fraction: `${reduced.numerator}/${reduced.denominator}`,
  };
}

export function convertDataUnit(source: string, sourceUnitId: string, targetUnitId: string): DataConversion {
  const amount = parseDecimal(source);
  const sourceUnit = unit(sourceUnitId);
  const targetUnit = unit(targetUnitId);
  return formatRational({
    numerator: amount.numerator * sourceUnit.bits,
    denominator: amount.denominator * targetUnit.bits,
  });
}

export function estimateTransferSeconds(size: string, sizeUnitId: string, rate: string, rateUnitId: string): DataConversion {
  const sizeAmount = parseDecimal(size);
  const rateAmount = parseDecimal(rate);
  if (rateAmount.numerator === 0n) {
    throw new RangeError('Transfer rate must be greater than zero.');
  }
  return formatRational({
    numerator: sizeAmount.numerator * unit(sizeUnitId).bits * rateAmount.denominator,
    denominator: sizeAmount.denominator * rateAmount.numerator * unit(rateUnitId).bits,
  }, 18);
}

export function formatDuration(secondsSource: string): string {
  const seconds = Number(secondsSource.replace('…', ''));
  if (!Number.isFinite(seconds)) {
    return 'outside display range';
  }
  if (seconds < 1) {
    return `${(seconds * 1000).toLocaleString('en-US', { maximumFractionDigits: 3 })} ms`;
  }
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  const remaining = seconds % 60;
  return [days && `${days} d`, (days || hours) && `${hours} h`, (days || hours || minutes) && `${minutes} min`, `${remaining.toLocaleString('en-US', { maximumFractionDigits: 3 })} s`].filter(Boolean).join(' ');
}
