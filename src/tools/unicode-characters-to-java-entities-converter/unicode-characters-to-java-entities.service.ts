function strlenFix(str: string): string {
  while (str.length < 4) {
    str = `0${str}`;
  }
  return str;
}

function parseUnicodeToJavaEntities(source: string): string {
  let result = '';

  for (let i = 0; i < source.length; i++) {
    const charCode = source.charCodeAt(i);
    if (charCode <= 127) {
      result += source.charAt(i);
    }
    else {
      result += `\\u${strlenFix(charCode.toString(16).toUpperCase())}`;
    }
  }
  return result;
}

function parseJavaEntitiesToUnicode(source: string): string {
  let result = '';
  let state: 0 | 1 | 2 = 0;
  let chars = 0;
  let value = '';
  for (let i = 0; i < source.length; i++) {
    switch (state) {
      case 0:
        if (source.charAt(i) === '\\') {
          state = 1;
        }
        else {
          result += source.charAt(i);
        }
        break;
      case 1:
        if (source.charAt(i) === 'u') {
          state = 2;
          chars = 0;
          value = '';
        }
        else {
          result += `\\${source.charAt(i)}`;
          state = 0;
        }
        break;
      case 2:
        chars++;
        value += source.charAt(i);
        if (chars >= 4) {
          result += String.fromCharCode(Number.parseInt(value, 16));
          state = 0;
        }
        break;
    }
  }

  return result;
}

export { parseUnicodeToJavaEntities, parseJavaEntitiesToUnicode };
