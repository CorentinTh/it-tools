export const MIN_ARABIC_TO_ROMAN = 1;
export const MAX_ARABIC_TO_ROMAN = 3999999;
export function arabicToRoman(num: number) {
  if (num < MIN_ARABIC_TO_ROMAN || num > MAX_ARABIC_TO_ROMAN) return '';

  const lookup: { [key: string]: number } = {
    '<span style="text-decoration: overline">M</span>': 1000000,
    '<span style="text-decoration: overline">CM</span>': 900000,
    '<span style="text-decoration: overline">D</span>': 500000,
    '<span style="text-decoration: overline">CD</span>': 400000,
    '<span style="text-decoration: overline">C</span>': 100000,
    '<span style="text-decoration: overline">XC</span>': 90000,
    '<span style="text-decoration: overline">L</span>': 50000,
    '<span style="text-decoration: overline">XL</span>': 40000,
    '<span style="text-decoration: overline">X</span>': 10000,
    '<span style="text-decoration: overline">IX</span>': 9000,
    '<span style="text-decoration: overline">V</span>': 5000,
    '<span style="text-decoration: overline">IV</span>': 4000,
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let roman = '';
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

const ROMAN_NUMBER_REGEX = new RegExp(/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/);

export function isValidRomanNumber(romanNumber: string) {
  return ROMAN_NUMBER_REGEX.test(romanNumber);
}

export function romanToArabic(s: string) {
  if (!isValidRomanNumber(s)) {
    return null;
  }
  const map: { [key: string]: number } = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  return [...s].reduce((r, c, i, s) => (map[s[i + 1]] > map[c] ? r - map[c] : r + map[c]), 0);
}
