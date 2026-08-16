import { describe, expect, it } from 'vitest';
import { formatOklch, mapOklchToSrgb, oklchToSrgb, parseOklch, removeAlphaChannelWhenOpaque, srgbToOklch } from './color-converter.models';

describe('color-converter models', () => {
  describe('removeAlphaChannelWhenOpaque', () => {
    it('remove alpha channel of an hex color when it is opaque (alpha = 1)', () => {
      expect(removeAlphaChannelWhenOpaque('#000000ff')).toBe('#000000');
      expect(removeAlphaChannelWhenOpaque('#ffffffFF')).toBe('#ffffff');
      expect(removeAlphaChannelWhenOpaque('#000000FE')).toBe('#000000FE');
      expect(removeAlphaChannelWhenOpaque('#00000000')).toBe('#00000000');
    });
  });

  it('round-trips sRGB through OKLCH within display rounding tolerance', () => {
    const oklch = srgbToOklch({ r: 255, g: 0, b: 0 });
    expect(formatOklch(oklch)).toMatch(/^oklch\(62\.79/u);
    const rgb = oklchToSrgb(oklch);
    expect(rgb.r).toBeCloseTo(255, 3);
    expect(rgb.g).toBeCloseTo(0, 3);
    expect(rgb.b).toBeCloseTo(0, 3);
  });

  it('parses CSS OKLCH, normalizes hue, and rejects invalid boundaries', () => {
    expect(parseOklch('oklch(50% 0.2 -30deg / 75%)')).toEqual({ l: 0.5, c: 0.2, h: 330, alpha: 0.75 });
    expect(() => parseOklch('oklch(120% -1 20)')).toThrow('requires L');
  });

  it('detects out-of-sRGB colors and maps by bounded constant-L/H chroma reduction', () => {
    const source = parseOklch('oklch(80.72% 0.3296 141.6)');
    expect(oklchToSrgb(source).inGamut).toBe(false);
    const mapped = mapOklchToSrgb(source);
    expect(mapped.rgb.inGamut).toBe(true);
    expect(mapped.color.l).toBe(source.l);
    expect(mapped.color.h).toBe(source.h);
    expect(mapped.color.c).toBeLessThan(source.c);
  });
});
