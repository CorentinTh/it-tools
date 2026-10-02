export { convertTextToAsciiBinary, convertAsciiBinaryToText };

/** UTF-8 bytes of each character, one octet per byte — ASCII text is
 *  unchanged, non-ASCII characters (accented letters, CJK, emoji) encode to
 *  their multi-byte representation instead of being truncated (#1082). */
function convertTextToAsciiBinary(text: string, { separator = ' ' }: { separator?: string } = {}): string {
  return [...new TextEncoder().encode(text)]
    .map(byte => byte.toString(2).padStart(8, '0'))
    .join(separator);
}

function convertAsciiBinaryToText(binary: string): string {
  const cleanBinary = binary.replace(/[^01]/g, '');

  if (cleanBinary.length % 8) {
    throw new Error('Invalid binary string');
  }

  const bytes = Uint8Array.from((cleanBinary.match(/.{8}/g) ?? []).map(octet => Number.parseInt(octet, 2)));
  return new TextDecoder().decode(bytes);
}
