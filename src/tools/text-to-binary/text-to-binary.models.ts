export { convertTextToAsciiBinary, convertAsciiBinaryToText, convertTextToUnicodeBinary, convertUnicodeBinaryToText, convertTextToUtf8Binary, convertUtf8BinaryToText };

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

function convertTextToUnicodeBinary(text: string, { separator = '' }: { separator?: string } = {}) {
  return text.split('').map((char) => {
    const code = char.charCodeAt(0);
    if (code > 127) {
      const charUnicode = code.toString(16);
      return `\\u${charUnicode}`;
    }
    else {
      return char;
    }
  }).join(separator);
};

function convertUnicodeBinaryToText(binary: string) {
  const character = binary.split('\\u');
  const native = character[0];// need to remove this char
  return native + character.map((code, idx) => {
    if (idx === 0) {
      return '';
    }
    let strValue = String.fromCharCode(Number.parseInt(`0x${code.substring(0, 4)}`));
    if (code.length > 4) {
      strValue += code.substring(4, code.length);
    }
    return strValue;
  }).join('');
}

function convertTextToUtf8Binary(text: string) {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[^\u0000-\u00FF]/g,
    ($0) => {
      return escape($0)
        .replace(/(%u)(\w{4})/gi, '&#x$2;');
    });
  // return EncodeUtf8(text);
};

function convertUtf8BinaryToText(binary: string) {
  return unescape(binary.replace(/&#x/g, '%u').replace(/;/g, ''));
}
