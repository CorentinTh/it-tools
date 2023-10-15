export { convertTextToAsciiBinary, convertAsciiBinaryToText };

function convertTextToAsciiBinary(text: string, { separator = ' ' }: { separator?: string } = {}): string {
  return text
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(separator);
}

function convertAsciiBinaryToText(binary: string): string {
  const cleanBinary = binary.replace(/[^01]/g, '');

  if (cleanBinary.length % 8) {
    throw new Error('Invalid binary string');
  }

  return cleanBinary
    .split(/(\d{8})/)
    .filter(Boolean)
    .map(binary => String.fromCharCode(Number.parseInt(binary, 2)))
    .join('');
}
