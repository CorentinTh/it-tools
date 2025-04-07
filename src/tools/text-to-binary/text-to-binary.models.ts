export { convertTextToUtf8Binary, convertUtf8BinaryToText };

export type EncodingBase = 2 | 8 | 10 | 16;

function convertTextToUtf8Binary(text: string, { separator = ' ', base = 2 }: { separator?: string; base?: EncodingBase } = {}): string {
  if (!text?.trim()) {
    return '';
  }

  return [...new TextEncoder().encode(text)].map((char) => {
    const charInBase = char.toString(base);
    if (base === 2) {
      return charInBase.padStart(8, '0');
    }
    if (base === 8) {
      return `0${charInBase}`;
    }
    if (base === 16) {
      return charInBase.padStart(2, '0');
    }

    return charInBase;
  }).join(separator);
}

function convertUtf8BinaryToText(binary: string, { base = 2 }: { base?: EncodingBase } = {}): string {
  if (!binary?.trim()) {
    return '';
  }

  let codepoints: number[] = [];
  if (base === 2) {
    const cleanBinary = binary.replace(/0b/g, '').replace(/[^01]/g, '').trim();

    if (cleanBinary.length % 8) {
      throw new Error('Invalid binary string');
    }

    codepoints = cleanBinary
      .split(/([01]{8})/)
      .filter(Boolean)
      .map(binary => Number.parseInt(binary, 2));
  }
  else if (base === 16) {
    const cleanBinary = binary.replace(/0x|\\x/g, '').replace(/[^0-9A-Fa-f]/g, '');

    if (cleanBinary.length % 2) {
      throw new Error('Invalid hexadecimal string');
    }

    codepoints = cleanBinary
      .split(/([0-9A-Fa-f]{2})/)
      .filter(Boolean)
      .map(binary => Number.parseInt(binary, 16));
  }
  else {
    const cleanBinary = binary.replace(/0o/g, '').replace(/[^\d\s]/g, '');
    codepoints = cleanBinary
      .split(/\s/)
      .filter(Boolean)
      .map(binary => Number.parseInt(binary, base));
  }

  return new TextDecoder(undefined, { fatal: true }).decode(
    Uint8Array.from(codepoints),
  );
}
