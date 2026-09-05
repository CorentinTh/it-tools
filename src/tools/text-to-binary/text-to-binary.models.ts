export { convertTextToUtf8Binary, convertUtf8BinaryToText };

function convertTextToUtf8Binary(text: string, { separator = ' ' }: { separator?: string } = {}): string {
  return Array.from(new TextEncoder().encode(text))
    .map(byte => byte.toString(2).padStart(8, '0'))
    .join(separator);
}

function convertUtf8BinaryToText(binary: string): string {
  const cleanBinary = binary.replace(/[^01]/g, '');

  if (cleanBinary.length % 8) {
    throw new Error('Invalid binary string');
  }

  const octets = cleanBinary.match(/\d{8}/g) ?? [];
  const bytes = Uint8Array.from(octets, octet => Number.parseInt(octet, 2));

  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
