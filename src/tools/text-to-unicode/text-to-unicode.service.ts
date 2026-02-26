function convertTextToUnicode(text: string): string {
  return text.split('').map(value => `&#${value.charCodeAt(0)};`).join('');
}

function convertTextToUnicodeHex(text: string): string {
  return Array.from(text).map((ch) => {
    const cp = ch.codePointAt(0)!;
    if (cp <= 0xFFFF) {
      return `\\u${cp.toString(16).padStart(4, '0')}`;
    }
    const high = 0xD800 + ((cp - 0x10000) >> 10);
    const low = 0xDC00 + ((cp - 0x10000) & 0x3FF);
    return `\\u${high.toString(16).padStart(4, '0')}\\u${low.toString(16).padStart(4, '0')}`;
  }).join('');
}

function convertUnicodeToText(unicodeStr: string): string {
  return unicodeStr
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number.parseInt(dec, 10)));
}

export { convertTextToUnicode, convertTextToUnicodeHex, convertUnicodeToText };
