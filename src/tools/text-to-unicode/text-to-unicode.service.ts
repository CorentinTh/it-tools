function convertTextToUnicode(text: string): string {
  return [...text].map(value => `&#${value.codePointAt(0)};`).join('');
}

function convertUnicodeToText(unicodeStr: string): string {
  return unicodeStr.replace(/&#(\d+);/g, (_match, dec) => String.fromCodePoint(Number(dec)));
}

/** Escape every code point as uXXXX (surrogate pairs for astral characters). */
function convertTextToUnicodeEscape(text: string): string {
  return [...text]
    .map((char) => {
      const codePoint = char.codePointAt(0)!;
      const hex = codePoint.toString(16).padStart(codePoint > 0xFFFF ? 8 : 4, '0');
      return `\\u${hex}`;
    })
    .join('');
}

function convertUnicodeEscapeToText(escapeStr: string): string {
  return escapeStr.replace(/\\u([0-9a-fA-F]{4,8})/g, (_match, hex) => String.fromCodePoint(Number.parseInt(hex, 16)));
}

export { convertTextToUnicode, convertUnicodeToText, convertTextToUnicodeEscape, convertUnicodeEscapeToText };
