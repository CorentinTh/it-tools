export function hasNumberPrefix(value: string) {
  return (value ?? '').trim().match(/^(0[xob].|&[hob].)/i);
}

export function convertBase(
  {
    value, fromBase, toBase,
    ignorePunctuationsRegexChars = ' \u00A0_\.,-',
    handlePrefixSuffix = true,
    ignoreCase = true,
  }: {
    value: string
    fromBase: number
    toBase: number
    ignorePunctuationsRegexChars?: string
    handlePrefixSuffix?: boolean
    ignoreCase?: boolean
  }) {
  let cleanedValue = (value ?? '0').trim();
  if (ignorePunctuationsRegexChars) {
    cleanedValue = cleanedValue.replace(new RegExp(`[${ignorePunctuationsRegexChars}]`, 'g'), '');
  }
  let finalFromBase = fromBase;
  if (handlePrefixSuffix) {
    for (const regBase of [
      { base: 2, regex: /^(&b|0b)?([01]+)([IULZn]*)$/i },
      { base: 8, regex: /^(&o|0o)?([0-7]+)([IULZn]*)$/i },
      { base: 16, regex: /^(&h|0x)?([a-f0-9]+)([IULZn]*)$/i },
    ]) {
      const match = cleanedValue.match(regBase.regex);
      if (match) {
        if (match[1]) {
          finalFromBase = regBase.base;
        }
        cleanedValue = match[2];
        break;
      }
    }
  }
  if (ignoreCase && finalFromBase <= 36) {
    cleanedValue = cleanedValue.toLowerCase();
  }
  const range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
  const fromRange = range.slice(0, finalFromBase);
  const toRange = range.slice(0, toBase);
  let decValue = cleanedValue
    .split('')
    .reverse()
    .reduce((carry: number, digit: string, index: number) => {
      if (!fromRange.includes(digit)) {
        throw new Error(`Invalid digit "${digit}" for base ${finalFromBase}.`);
      }
      return (carry += fromRange.indexOf(digit) * finalFromBase ** index);
    }, 0);
  let newValue = '';
  while (decValue > 0) {
    newValue = toRange[decValue % toBase] + newValue;
    decValue = (decValue - (decValue % toBase)) / toBase;
  }
  return newValue || '0';
}
