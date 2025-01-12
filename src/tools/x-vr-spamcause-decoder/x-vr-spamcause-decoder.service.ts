function unrot(a: string, b: string, pos: number) {
  if (b === undefined) {
    return '';
  }

  if (pos % 2 === 0) {
    const c = a;
    a = b;
    b = c;
  }

  const offset = ('g'.charCodeAt(0) - a.charCodeAt(0)) * 16;
  return String.fromCharCode((a.charCodeAt(0) + b.charCodeAt(0)) - 'x'.charCodeAt(0) - offset);
}

export function spamCauseDecode(text: string) {
  let result = '';

  for (let n = 0; n < text.length; n += 2) {
    result += unrot(text[n], text[n + 1], Math.floor(n / 2));
  }

  return result;
}
