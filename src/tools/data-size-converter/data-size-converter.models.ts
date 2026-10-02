export const dataSizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

export type DataSizeUnit = (typeof dataSizeUnits)[number];

export type DataSizeBase = 1000 | 1024;

const UNIT_INDEX: Record<DataSizeUnit, number> = Object.fromEntries(
  dataSizeUnits.map((unit, index) => [unit, index]),
) as Record<DataSizeUnit, number>;

export function convertDataSize({
  value,
  from,
  to,
  base,
}: {
  value: number
  from: DataSizeUnit
  to: DataSizeUnit
  base: DataSizeBase
}): number {
  const bytes = value * base ** UNIT_INDEX[from];
  return bytes / base ** UNIT_INDEX[to];
}
