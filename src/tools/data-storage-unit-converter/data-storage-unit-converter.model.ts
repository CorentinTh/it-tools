export function convertStorage({ value, fromUnit, toUnit }: { value: number; fromUnit: string; toUnit: string }): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const factor = 1024;
  const fromIndex = units.indexOf(fromUnit);
  const toIndex = units.indexOf(toUnit);
  const exponent = fromIndex - toIndex;

  const result = value * factor ** exponent;
  return result.toString();
}
