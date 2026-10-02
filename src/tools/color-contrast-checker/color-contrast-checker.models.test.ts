import { describe, expect, it } from 'vitest';
import { checkContrast, contrastRatio, formatRgb, parseColor, relativeLuminance } from './color-contrast-checker.models';

describe('parseColor', () => {
  it('parses hex 3/6 and rgb()/rgba() forms', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseColor('#1e88e5')).toEqual({ r: 0x1E, g: 0x88, b: 0xE5 });
    expect(parseColor('rgb(30, 136, 229)')).toEqual({ r: 30, g: 136, b: 229 });
    expect(parseColor('rgba(0, 0, 0, 0.5)')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('returns undefined for garbage', () => {
    expect(parseColor('not-a-color')).toBeUndefined();
    expect(parseColor('#12345')).toBeUndefined();
    expect(parseColor('rgb(300, 0, 0)')).toBeUndefined();
  });
});

describe('relativeLuminance and contrastRatio', () => {
  it('black is 0 and white is 1', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1);
  });

  it('gives the canonical WCAG ratios', () => {
    // black on white = 21:1
    expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBe(21);
    // #767676 on white = 4.54:1 (the canonical AA-passing gray)
    expect(contrastRatio({ r: 0x76, g: 0x76, b: 0x76 }, { r: 255, g: 255, b: 255 })).toBe(4.54);
  });

  it('is symmetric regardless of which color is lighter', () => {
    const a = { r: 0x1E, g: 0x88, b: 0xE5 };
    const b = { r: 255, g: 255, b: 255 };
    expect(contrastRatio(a, b)).toBe(contrastRatio(b, a));
  });
});

describe('checkContrast', () => {
  it('flags thresholds for normal and large text', () => {
    const result = checkContrast({ r: 0x76, g: 0x76, b: 0x76 }, { r: 255, g: 255, b: 255 });
    expect(result.ratio).toBe(4.54);
    expect(result.aaNormal).toBe(true);
    expect(result.aaaNormal).toBe(false);
    expect(result.aaLarge).toBe(true);
    expect(result.aaaLarge).toBe(true);
    expect(result.uiComponents).toBe(true);
  });

  it('reports which color is lighter', () => {
    const result = checkContrast({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
    expect(result.lighter).toEqual({ r: 255, g: 255, b: 255 });
    expect(result.darker).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('fails everything for identical colors', () => {
    const result = checkContrast({ r: 128, g: 128, b: 128 }, { r: 128, g: 128, b: 128 });
    expect(result.ratio).toBe(1);
    expect(result.aaNormal).toBe(false);
    expect(result.uiComponents).toBe(false);
  });
});

describe('formatRgb', () => {
  it('formats as css rgb()', () => {
    expect(formatRgb({ r: 30, g: 136, b: 229 })).toBe('rgb(30, 136, 229)');
  });
});
