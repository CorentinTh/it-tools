import { describe, expect, it } from 'vitest';
import { convertToChineseNumeral } from './chinese-numeral-converter.models';

const rmb = (input: string) => convertToChineseNumeral(input, { style: 'uppercase', currency: true });
function plain(input: string, style: 'uppercase' | 'lowercase' = 'lowercase') {
  return convertToChineseNumeral(input, { style, currency: false });
}

describe('chinese-numeral-converter: currency mode', () => {
  it('converts integer amounts', () => {
    expect(rmb('0').result).toBe('零元整');
    expect(rmb('1').result).toBe('壹元整');
    expect(rmb('10').result).toBe('壹拾元整');
    expect(rmb('15').result).toBe('壹拾伍元整');
    expect(rmb('110').result).toBe('壹佰壹拾元整');
    expect(rmb('1001').result).toBe('壹仟零壹元整');
    expect(rmb('10000').result).toBe('壹万元整');
    expect(rmb('10001').result).toBe('壹万零壹元整');
    expect(rmb('100000001').result).toBe('壹亿零壹元整');
    expect(rmb('100010001').result).toBe('壹亿零壹万零壹元整');
    expect(rmb('123456789').result).toBe('壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元整');
    expect(rmb('123405001').result).toBe('壹亿贰仟叁佰肆拾万伍仟零壹元整');
    expect(rmb('123450001').result).toBe('壹亿贰仟叁佰肆拾伍万零壹元整');
    expect(rmb('1000000000000').result).toBe('壹兆元整');
  });

  it('converts amounts with decimals', () => {
    expect(rmb('1234.56').result).toBe('壹仟贰佰叁拾肆元伍角陆分');
    expect(rmb('1.05').result).toBe('壹元零伍分');
    expect(rmb('1.50').result).toBe('壹元伍角整');
    expect(rmb('1.5').result).toBe('壹元伍角整');
    expect(rmb('0.15').result).toBe('壹角伍分');
    expect(rmb('0.05').result).toBe('伍分');
    expect(rmb('5.00').result).toBe('伍元整');
    expect(rmb('0.00').result).toBe('零元整');
    expect(rmb('10.02').result).toBe('壹拾元零贰分');
  });

  it('handles negatives and leading zeros', () => {
    expect(rmb('-123').result).toBe('负壹佰贰拾叁元整');
    expect(rmb('001234.56').result).toBe('壹仟贰佰叁拾肆元伍角陆分');
    expect(rmb('¥1,234.56').result).toBe('壹仟贰佰叁拾肆元伍角陆分');
    expect(rmb('￥1,234.56').result).toBe('壹仟贰佰叁拾肆元伍角陆分');
  });

  it('rejects invalid amounts', () => {
    expect(rmb('')?.error).toBeTruthy();
    expect(rmb('abc')?.error).toBeTruthy();
    expect(rmb('1.234')?.error).toBeTruthy();
    expect(rmb('-').result).toBeUndefined();
  });

  it('rejects too long integers', () => {
    expect(rmb('1'.repeat(17))?.error).toBeTruthy();
    expect(rmb('1000000000000000').result).toBe('壹仟兆元整');
  });
});

describe('chinese-numeral-converter: plain number mode', () => {
  it('converts integers in lowercase style', () => {
    expect(plain('0').result).toBe('零');
    expect(plain('10').result).toBe('十');
    expect(plain('15').result).toBe('十五');
    expect(plain('110').result).toBe('一百一十');
    expect(plain('1001').result).toBe('一千零一');
    expect(plain('10000').result).toBe('一万');
    expect(plain('100010001').result).toBe('一亿零一万零一');
    expect(plain('123405001').result).toBe('一亿二千三百四十万五千零一');
    expect(plain('1000000000').result).toBe('十亿');
  });

  it('converts integers in uppercase style', () => {
    expect(plain('10', 'uppercase').result).toBe('壹拾');
    expect(plain('110', 'uppercase').result).toBe('壹佰壹拾');
  });

  it('converts decimals digit by digit', () => {
    expect(plain('3.1415926').result).toBe('三点一四一五九二六');
    expect(plain('0.5').result).toBe('零点五');
    expect(plain('-2.5', 'uppercase').result).toBe('负贰点伍');
  });

  it('rejects too long decimals', () => {
    expect(plain('1.1234567890')?.error).toBeTruthy();
  });
});
