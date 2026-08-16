export type RaidLevel = '0' | '1' | '5' | '6' | '10';

export interface StorageUnit {
  id: string
  label: string
  bytes: bigint
}

interface Rational {
  numerator: bigint
  denominator: bigint
}

export interface RaidCalculation {
  level: RaidLevel
  diskCount: number
  dataDiskCount: number
  overheadDiskCount: number
  guaranteedDiskFailures: number
  maximumDiskFailures: number
  failureDescription: string
  efficiency: string
  rawCapacity: string
  usableCapacity: string
  overheadCapacity: string
  usableBytesFraction: string
}

export const RAID_STORAGE_UNITS: StorageUnit[] = [
  { id: 'GB', label: 'GB (10⁹ bytes, drive label)', bytes: 1_000_000_000n },
  { id: 'TB', label: 'TB (10¹² bytes, drive label)', bytes: 1_000_000_000_000n },
  { id: 'PB', label: 'PB (10¹⁵ bytes)', bytes: 1_000_000_000_000_000n },
  { id: 'GiB', label: 'GiB (2³⁰ bytes)', bytes: 1_073_741_824n },
  { id: 'TiB', label: 'TiB (2⁴⁰ bytes)', bytes: 1_099_511_627_776n },
  { id: 'PiB', label: 'PiB (2⁵⁰ bytes)', bytes: 1_125_899_906_842_624n },
];

const LEVEL_MINIMUM_DISKS: Record<RaidLevel, number> = { 0: 2, 1: 2, 5: 3, 6: 4, 10: 4 };

function gcd(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

function reduce(value: Rational): Rational {
  const divisor = gcd(value.numerator, value.denominator);
  return { numerator: value.numerator / divisor, denominator: value.denominator / divisor };
}

function parsePositiveDecimal(source: string): Rational {
  const match = /^(\d{1,36})(?:\.(\d{1,9}))?$/u.exec(source.trim());
  if (!match) {
    throw new TypeError('Enter a positive decimal with at most 36 integer and 9 fractional digits.');
  }
  const fraction = match[2] ?? '';
  const value = reduce({ numerator: BigInt(`${match[1]}${fraction}`), denominator: 10n ** BigInt(fraction.length) });
  if (value.numerator === 0n) {
    throw new RangeError('Disk capacity must be greater than zero.');
  }
  return value;
}

function storageUnit(id: string): StorageUnit {
  const selected = RAID_STORAGE_UNITS.find(unit => unit.id === id);
  if (!selected) {
    throw new TypeError('Select a supported storage unit.');
  }
  return selected;
}

function formatRational(value: Rational, maximumFractionDigits = 6): string {
  const reduced = reduce(value);
  const integer = reduced.numerator / reduced.denominator;
  let remainder = reduced.numerator % reduced.denominator;
  if (remainder === 0n) {
    return integer.toString();
  }
  let fraction = '';
  for (let index = 0; index < maximumFractionDigits && remainder !== 0n; index += 1) {
    remainder *= 10n;
    fraction += (remainder / reduced.denominator).toString();
    remainder %= reduced.denominator;
  }
  return `${integer}.${fraction.replace(/0+$/u, '')}${remainder === 0n ? '' : '…'}`;
}

function multiply(value: Rational, factor: bigint): Rational {
  return reduce({ numerator: value.numerator * factor, denominator: value.denominator });
}

function subtract(left: Rational, right: Rational): Rational {
  return reduce({
    numerator: left.numerator * right.denominator - right.numerator * left.denominator,
    denominator: left.denominator * right.denominator,
  });
}

function formatCapacity(bytes: Rational, outputUnit: StorageUnit): string {
  return `${formatRational({ numerator: bytes.numerator, denominator: bytes.denominator * outputUnit.bytes })} ${outputUnit.id}`;
}

function dataDisks(level: RaidLevel, diskCount: number): number {
  if (level === '0') {
    return diskCount;
  }
  if (level === '1') {
    return 1;
  }
  if (level === '5') {
    return diskCount - 1;
  }
  if (level === '6') {
    return diskCount - 2;
  }
  return diskCount / 2;
}

function failureTolerance(level: RaidLevel, diskCount: number): Pick<RaidCalculation, 'guaranteedDiskFailures' | 'maximumDiskFailures' | 'failureDescription'> {
  if (level === '0') {
    return { guaranteedDiskFailures: 0, maximumDiskFailures: 0, failureDescription: 'No disk failure is tolerated.' };
  }
  if (level === '1') {
    return { guaranteedDiskFailures: diskCount - 1, maximumDiskFailures: diskCount - 1, failureDescription: `Any ${diskCount - 1} disk failure${diskCount === 2 ? '' : 's'} can be tolerated while one mirror remains.` };
  }
  if (level === '5') {
    return { guaranteedDiskFailures: 1, maximumDiskFailures: 1, failureDescription: 'Any one disk failure is tolerated.' };
  }
  if (level === '6') {
    return { guaranteedDiskFailures: 2, maximumDiskFailures: 2, failureDescription: 'Any two simultaneous disk failures are tolerated.' };
  }
  return {
    guaranteedDiskFailures: 1,
    maximumDiskFailures: diskCount / 2,
    failureDescription: `Any one disk failure is tolerated; up to ${diskCount / 2} may be tolerated only when no mirror pair loses both disks.`,
  };
}

export function calculateRaidStorage(input: {
  level: RaidLevel
  diskCount: number
  diskCapacity: string
  inputUnitId: string
  outputUnitId: string
}): RaidCalculation {
  const { level, diskCount } = input;
  if (!(level in LEVEL_MINIMUM_DISKS)) {
    throw new TypeError('Select a supported RAID level.');
  }
  if (!Number.isSafeInteger(diskCount) || diskCount < LEVEL_MINIMUM_DISKS[level] || diskCount > 128) {
    throw new RangeError(`RAID ${level} requires ${LEVEL_MINIMUM_DISKS[level]}–128 disks.`);
  }
  if (level === '10' && diskCount % 2 !== 0) {
    throw new RangeError('RAID 10 requires an even disk count so every disk has one mirror partner.');
  }

  const inputUnit = storageUnit(input.inputUnitId);
  const outputUnit = storageUnit(input.outputUnitId);
  const capacity = parsePositiveDecimal(input.diskCapacity);
  const oneDiskBytes = reduce({ numerator: capacity.numerator * inputUnit.bytes, denominator: capacity.denominator });
  const dataDiskCount = dataDisks(level, diskCount);
  const rawBytes = multiply(oneDiskBytes, BigInt(diskCount));
  const usableBytes = multiply(oneDiskBytes, BigInt(dataDiskCount));
  const overheadBytes = subtract(rawBytes, usableBytes);

  return {
    level,
    diskCount,
    dataDiskCount,
    overheadDiskCount: diskCount - dataDiskCount,
    ...failureTolerance(level, diskCount),
    efficiency: `${formatRational({ numerator: BigInt(dataDiskCount * 100), denominator: BigInt(diskCount) }, 3)}%`,
    rawCapacity: formatCapacity(rawBytes, outputUnit),
    usableCapacity: formatCapacity(usableBytes, outputUnit),
    overheadCapacity: formatCapacity(overheadBytes, outputUnit),
    usableBytesFraction: `${usableBytes.numerator}/${usableBytes.denominator} bytes`,
  };
}

export function formatRaidSummary(input: {
  diskCapacity: string
  inputUnitId: string
  outputUnitId: string
}, result: RaidCalculation): string {
  return [
    `RAID ${result.level}: ${result.diskCount} × ${input.diskCapacity} ${input.inputUnitId}`,
    `Raw capacity: ${result.rawCapacity}`,
    `Usable capacity: ${result.usableCapacity}`,
    `Parity/mirror overhead: ${result.overheadCapacity} (${result.overheadDiskCount} disk-equivalent)`,
    `Capacity efficiency: ${result.efficiency}`,
    `Failure tolerance: ${result.failureDescription}`,
    `Exact usable capacity: ${result.usableBytesFraction}`,
    '',
    'Assumptions: all disks have the entered capacity; the smallest disk limits a mixed array; filesystem, controller, spare, metadata, and rebuild overhead are excluded.',
  ].join('\n');
}
