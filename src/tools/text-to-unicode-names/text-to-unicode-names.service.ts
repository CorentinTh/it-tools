import unicode from '@unicode/unicode-15.1.0/Names/index.js';

export function convertTextToUnicodeNames(text: string, { separator = ' ' }: { separator?: string } = {}): string {
  return [...text]
    .map(char => `${char} (U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}: ${(unicode.get(char.codePointAt(0)) || 'UNKNOWN CHARACTER')})`)
    .join(separator);
}
