export function convertStorageAndRateUnits(
  { value, fromUnit, toUnit, precision = 3 }:
  { value: number; fromUnit: string; toUnit: string; precision?: number }): string {
  const units = [
    'iB', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB',
    'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB',
    'b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb',
  ];

  const fromIndex = units.indexOf(fromUnit);
  const fromFactor = fromIndex / 9 > 1 ? 1000 : 1024;
  const fromDivisor = fromIndex / 9 > 2 ? 8 : 1;
  const toIndex = units.indexOf(toUnit);
  const toFactor = toIndex / 9 > 1 ? 1000 : 1024;
  const toDivisor = toIndex / 9 > 2 ? 8 : 1;

  const fromBase = (fromFactor ** (fromIndex % 9)) / fromDivisor;
  const toBase = (toFactor ** (toIndex % 9)) / toDivisor;

  const result = value * fromBase / toBase;
  return result.toLocaleString(undefined, {
    maximumFractionDigits: precision,
  });
}
