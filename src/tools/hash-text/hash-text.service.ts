export function convertHexToBin(hex: string) {
  return hex
    .trim()
    .split('')
    .map(byte => parseInt(byte, 16).toString(2).padStart(4, '0'))
    .join('');
}
