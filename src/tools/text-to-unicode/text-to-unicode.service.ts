function convertTextToUnicode(text: string): string {
  return text.split('').map(value => `&#${value.charCodeAt(0)};`).join('');
}

function convertUnicodeToText(unicodeStr: string): string {
  return unicodeStr.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
}

export { convertTextToUnicode, convertUnicodeToText };
