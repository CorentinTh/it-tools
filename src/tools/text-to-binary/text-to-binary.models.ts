export { convertTextToUtf8Binary, convertUtf8BinaryToText };

function convertTextToUtf8Binary(text: string, { separator = ' ' }: { separator?: string } = {}): string {
  return [...new TextEncoder().encode(text)].map(x => x.toString(2).padStart(8, '0')).join(separator);
}

function convertUtf8BinaryToText(binary: string): string {
  const cleanBinary = binary.replace(/[^01]+/g, '');

  if (cleanBinary.length % 8) {
    throw new Error('Invalid binary string');
  }

  return new TextDecoder(undefined, { fatal: true }).decode(
    Uint8Array.from({ length: cleanBinary.length / 8 }, (_, i) =>
      Number.parseInt(cleanBinary.slice(i * 8, (i + 1) * 8), 2),
    ),
  );
}
