export type Encoding = 'htmldec' | 'htmlhex' | 'uniplus' | 'antiuni' | 'css' | 'python' | 'js' | 'utf16';

const ALL_PRINTABLE_ASCII = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

function convertTextToUnicode(text: string, { encoding = 'htmldec', skipAscii = false }: { encoding?: Encoding; skipAscii?: boolean } = {}): string {
  let prefix: (value: number) => string;
  let suffix: (value: number) => string = () => '';
  let base = 16;
  let padding: (value: number) => number = () => 0;
  let separator = '';
  let codepoints = [...text];
  if (encoding === 'htmldec') {
    prefix = () => '&#';
    base = 10;
    suffix = () => ';';
  }
  else if (encoding === 'htmlhex') {
    prefix = () => '&#x';
    suffix = () => ';';
  }
  else if (encoding === 'uniplus') {
    prefix = () => 'U+';
    padding = () => 5;
    separator = ' ';
  }
  else if (encoding === 'antiuni') {
    prefix = () => '\\u';
    padding = (value: number) => value < 256 ? 2 : 4;
  }
  else if (encoding === 'utf16') {
    prefix = () => '\\u';
    padding = () => 4;
    codepoints = text.split('');
  }
  else if (encoding === 'python') {
    prefix = (value: number) => value < 256 ? '\\x' : (value < 65536 ? '\\u' : '\\U');
    padding = (value: number) => value < 256 ? 2 : 4;
  }
  else if (encoding === 'js') {
    prefix = (value: number) => value < 65536 ? '\\u' : '\\u{';
    suffix = (value: number) => value < 65536 ? '' : '}';
    padding = () => 4;
  }
  else if (encoding === 'css') {
    prefix = () => '\\';
    padding = () => 6;
  }

  return codepoints.map((value) => {
    if (skipAscii && ALL_PRINTABLE_ASCII.includes(value)) {
      return value;
    }
    const charCode = value.codePointAt(0) || 0xFF;
    return `${prefix(charCode)}${charCode.toString(base).padStart(padding(charCode), '0')}${suffix(charCode)}`;
  }).join(separator);
}

function convertUnicodeToText(unicodeStr: string): string {
  return unicodeStr
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(dec))
    .replace(/&#[xX]([0-9A-Fa-f]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/\\u\{([0-9A-Fa-f]+)\}/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/(?:\\[uUx]|\\|\s*U\+)([0-9A-Fa-f]+)/g, (match, hex) => String.fromCodePoint(Number.parseInt(hex, 16))); // NOSONAR
}

export { convertTextToUnicode, convertUnicodeToText };
