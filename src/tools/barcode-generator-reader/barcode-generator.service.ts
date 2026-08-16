export const BARCODE_FORMATS = ['code128', 'ean13', 'upca'] as const;
export type BarcodeFormat = typeof BARCODE_FORMATS[number];

export interface EncodedBarcode {
  format: BarcodeFormat
  normalizedValue: string
  modules: string
}

const CODE128_PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112',
] as const;
const EAN_L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const EAN_G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
const EAN_R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const EAN_PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

function widthsToModules(widths: string): string {
  let black = true;
  let modules = '';
  for (const width of widths) {
    modules += (black ? '1' : '0').repeat(Number(width));
    black = !black;
  }
  return modules;
}

function encodeCode128(value: string): EncodedBarcode {
  if (value.length < 1 || value.length > 120 || [...value].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) > 126)) {
    throw new Error('Code 128 supports 1–120 printable ASCII characters.');
  }
  const data = [...value].map(character => character.charCodeAt(0) - 32);
  const startCode = 104;
  const checksum = (startCode + data.reduce((sum, code, index) => sum + code * (index + 1), 0)) % 103;
  const codewords = [startCode, ...data, checksum, 106];
  return {
    format: 'code128',
    normalizedValue: value,
    modules: codewords.map(codeword => widthsToModules(CODE128_PATTERNS[codeword])).join(''),
  };
}

export function calculateEanCheckDigit(value: string): number {
  if (!/^\d+$/.test(value) || (value.length !== 11 && value.length !== 12)) {
    throw new Error('Checksum input must contain 11 UPC-A or 12 EAN-13 digits.');
  }
  const sum = [...value].reduce((total, digit, index) => {
    const fromRight = value.length - index;
    return total + Number(digit) * (fromRight % 2 === 1 ? 3 : 1);
  }, 0);
  return (10 - sum % 10) % 10;
}

function normalizeEan(value: string, dataLength: number, label: string): string {
  if (!/^\d+$/.test(value) || (value.length !== dataLength && value.length !== dataLength + 1)) {
    throw new Error(`${label} requires ${dataLength} data digits or ${dataLength + 1} digits including checksum.`);
  }
  const data = value.slice(0, dataLength);
  const check = calculateEanCheckDigit(data);
  if (value.length === dataLength + 1 && Number(value[dataLength]) !== check) {
    throw new Error(`${label} checksum digit is invalid; expected ${check}.`);
  }
  return `${data}${check}`;
}

function encodeEan13(value: string, outputFormat: 'ean13' | 'upca'): EncodedBarcode {
  const normalized = outputFormat === 'upca'
    ? normalizeEan(value, 11, 'UPC-A')
    : normalizeEan(value, 12, 'EAN-13');
  const ean = outputFormat === 'upca' ? `0${normalized}` : normalized;
  const parity = EAN_PARITY[Number(ean[0])];
  let modules = '101';
  for (let index = 1; index <= 6; index++) {
    const digit = Number(ean[index]);
    modules += parity[index - 1] === 'L' ? EAN_L[digit] : EAN_G[digit];
  }
  modules += '01010';
  for (let index = 7; index <= 12; index++) {
    modules += EAN_R[Number(ean[index])];
  }
  modules += '101';
  return { format: outputFormat, normalizedValue: normalized, modules };
}

export function encodeBarcode(value: string, format: BarcodeFormat): EncodedBarcode {
  if (format === 'code128') {
    return encodeCode128(value);
  }
  if (format === 'ean13') {
    return encodeEan13(value, 'ean13');
  }
  if (format === 'upca') {
    return encodeEan13(value, 'upca');
  }
  throw new Error('Select a supported barcode format.');
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function renderBarcodeSvg(encoded: EncodedBarcode, moduleWidth = 2, barHeight = 80): string {
  if (!Number.isSafeInteger(moduleWidth) || moduleWidth < 1 || moduleWidth > 8 || !Number.isSafeInteger(barHeight) || barHeight < 32 || barHeight > 400) {
    throw new Error('Barcode dimensions are outside the supported range.');
  }
  const quietModules = 10;
  const width = (encoded.modules.length + quietModules * 2) * moduleWidth;
  const height = barHeight + 30;
  const bars: string[] = [];
  let start = -1;
  for (let index = 0; index <= encoded.modules.length; index++) {
    if (encoded.modules[index] === '1' && start < 0) {
      start = index;
    }
    if (encoded.modules[index] !== '1' && start >= 0) {
      bars.push(`<rect x="${(quietModules + start) * moduleWidth}" y="0" width="${(index - start) * moduleWidth}" height="${barHeight}"/>`);
      start = -1;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(encoded.normalizedValue)}"><rect width="100%" height="100%" fill="white"/><g fill="black">${bars.join('')}</g><text x="${width / 2}" y="${barHeight + 22}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="16" fill="black">${escapeXml(encoded.normalizedValue)}</text></svg>`;
}
