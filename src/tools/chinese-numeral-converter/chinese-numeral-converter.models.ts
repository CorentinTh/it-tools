export type ChineseNumeralStyle = 'uppercase' | 'lowercase';

const UPPERCASE_DIGITS = '零壹贰叁肆伍陆柒捌玖';
const LOWERCASE_DIGITS = '零一二三四五六七八九';

const UPPERCASE_GROUP_UNITS = ['仟', '佰', '拾'] as const;
const LOWERCASE_GROUP_UNITS = ['千', '百', '十'] as const;

// Units appended after each 4-digit section, from the highest section down.
const SECTION_UNITS = ['', '万', '亿', '兆'] as const;

export const MAX_INTEGER_DIGITS = SECTION_UNITS.length * 4;
export const MAX_DECIMAL_DIGITS = 2;

function digitsForStyle(style: ChineseNumeralStyle): string {
  return style === 'uppercase' ? UPPERCASE_DIGITS : LOWERCASE_DIGITS;
}

function groupUnitsForStyle(style: ChineseNumeralStyle): readonly string[] {
  return style === 'uppercase' ? UPPERCASE_GROUP_UNITS : LOWERCASE_GROUP_UNITS;
}

/** Render a single 4-digit section (already zero-padded) without its section unit. */
function groupToChinese(paddedGroup: string, style: ChineseNumeralStyle): string {
  const digits = digitsForStyle(style);
  const units = groupUnitsForStyle(style);
  let result = '';
  let zeroPending = false;

  for (let index = 0; index < paddedGroup.length; index++) {
    const digit = Number(paddedGroup[index]);
    if (digit === 0) {
      zeroPending = result !== '';
      continue;
    }

    if (zeroPending) {
      result += digits[0];
      zeroPending = false;
    }
    const unit = index === paddedGroup.length - 1 ? '' : units[index];
    result += digits[digit] + unit;
  }

  return result;
}

/** Render the integer part of a digit-only string (no sign, no separators). */
function integerToChinese(integer: string, style: ChineseNumeralStyle): string {
  const digits = digitsForStyle(style);
  const sections: string[] = [];
  for (let end = integer.length; end > 0; end -= 4) {
    sections.unshift(integer.slice(Math.max(0, end - 4), end));
  }

  let result = '';
  let zeroPending = false;

  sections.forEach((section, index) => {
    const unit = SECTION_UNITS[sections.length - 1 - index] ?? '';
    const padded = section.padStart(4, '0');
    const groupText = groupToChinese(padded, style);

    if (groupText) {
      // A section whose group has leading zeros (or follows a fully zero
      // section) reads with a linking zero, e.g. 一亿零一万, 一亿零一.
      if (result && (zeroPending || padded.startsWith('0'))) {
        result += digits[0];
      }
      result += groupText + unit;
      zeroPending = false;
    }
    else {
      zeroPending = result !== '';
    }
  });

  result = result || digits[0];

  // Natural reading drops the leading 一 in 一十X (十五, not 一十五);
  // the uppercase financial style keeps 壹拾 for tamper resistance.
  if (style === 'lowercase' && result.startsWith('一十')) {
    result = result.slice(1);
  }

  return result;
}

/** Render 1 or 2 decimal digits as 角/分. linkZero adds the linking 零 before
 *  分 when 角 is zero — only wanted when a 元 part precedes (壹元零伍分). */
function decimalsToRmb(decimals: string, digits: string, linkZero: boolean): string {
  const jiao = Number(decimals[0] ?? 0);
  const fen = Number(decimals[1] ?? 0);
  let result = '';

  if (jiao !== 0) {
    result += `${digits[jiao]}角`;
  }
  if (fen !== 0) {
    if (jiao === 0 && linkZero) {
      result += digits[0];
    }
    result += `${digits[fen]}分`;
  }
  return result;
}

export interface ConvertOptions {
  style: ChineseNumeralStyle
  /** 金额模式: reads as RMB (元/角/分/整). Otherwise reads as a bare number. */
  currency: boolean
}

export function convertToChineseNumeral(input: string, options: ConvertOptions): { result?: string; error?: string } {
  const cleaned = input.trim().replace(/[,，\s¥￥]/g, '');

  if (!cleaned) {
    return { error: 'Enter a number' };
  }

  const negative = cleaned.startsWith('-');
  const unsigned = negative ? cleaned.slice(1) : cleaned;

  if (!/^\d+(\.\d+)?$/.test(unsigned)) {
    return { error: 'Invalid number' };
  }

  const [integerPart, decimalPart] = unsigned.split('.');
  const integer = integerPart.replace(/^0+(?=\d)/, '');
  const style = options.style;

  if (integer.length > MAX_INTEGER_DIGITS) {
    return { error: `Supports up to ${MAX_INTEGER_DIGITS} integer digits` };
  }

  if (negative && integer === '0' && !decimalPart) {
    return { error: 'Invalid number' };
  }

  const sign = negative ? '负' : '';
  const digits = digitsForStyle(style);

  if (!options.currency) {
    if (!decimalPart) {
      return { result: sign + integerToChinese(integer, style) };
    }
    if (decimalPart.length > 9) {
      return { error: 'Supports up to 9 decimal digits' };
    }
    const integerText = integerToChinese(integer, style);
    const decimalText = decimalPart
      .replace(/0+$/, '')
      .split('')
      .map(digit => digits[Number(digit)])
      .join('');
    return { result: `${sign}${integerText}点${decimalText || digits[0]}` };
  }

  if (decimalPart && decimalPart.length > MAX_DECIMAL_DIGITS) {
    return { error: `Currency amounts support up to ${MAX_DECIMAL_DIGITS} decimal digits` };
  }

  const isZeroAmount = integer === '0' && (!decimalPart || Number(decimalPart) === 0);
  if (isZeroAmount) {
    return { result: `${digits[0]}元整` };
  }

  const hasJiao = Boolean(decimalPart?.[0] && decimalPart[0] !== '0');
  const hasFen = Boolean(decimalPart?.[1] && decimalPart[1] !== '0');
  const integerText = integerToChinese(integer, style);

  let result = sign + (integer === '0' ? '' : `${integerText}元`);

  if (!decimalPart || (!hasJiao && !hasFen)) {
    return { result: `${result}整` };
  }

  result += decimalsToRmb(decimalPart, digits, integer !== '0');

  // 有角无分时补整, e.g. 壹元伍角整.
  if (hasJiao && !hasFen) {
    result += '整';
  }

  return { result };
}
