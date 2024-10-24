export type BibytesUnits = 'iB' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB' | 'EiB' | 'ZiB' | 'YiB';
export type BytesUnits = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB';
export type BitsUnits = 'b' | 'Kb' | 'Mb' | 'Gb' | 'Tb' | 'Pb' | 'Eb' | 'Zb' | 'Yb';
export type AllSupportedUnits = BibytesUnits | BytesUnits | BitsUnits;

export function displayStorageAndRateUnits(
  { value, unit, precision = 3, appendUnit = false }:
  { value: number; unit: AllSupportedUnits; precision?: number ; appendUnit?: boolean }): string {
  return value.toFixed(precision).replace(/0+$/, '').replace(/\.$/, '') + (appendUnit ? unit : ''); // NOSONAR
}

export function convertStorageAndRateUnitsDisplay(
  { value, fromUnit, toUnit, precision = 3, appendUnit = false }:
  { value: number; fromUnit: AllSupportedUnits; toUnit: AllSupportedUnits; precision?: number; appendUnit?: boolean }): string {
  return displayStorageAndRateUnits({
    precision,
    unit: toUnit,
    appendUnit,
    value: convertStorageAndRateUnits({
      value, fromUnit, toUnit,
    }),
  });
}

export function convertStorageAndRateUnits(
  { value, fromUnit, toUnit }:
  { value: number; fromUnit: AllSupportedUnits; toUnit: AllSupportedUnits }): number {
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

  return value * fromBase / toBase;
}
