import { describe, expect, test } from 'vitest';
import { darken, lighten, setOpacity } from './color.models';

describe('color models', () => {
  describe('lighten', () => {
    test('lightens a color', () => {
      expect(lighten('#000000', 10)).toBe('#0a0a0a');
      expect(lighten('#000000', 20)).toBe('#141414');
      expect(lighten('#ffffff', 30)).toBe('#ffffff');
    });

    test('lightens a color with alpha', () => {
      expect(lighten('#00000080', 10)).toBe('#0a0a0a80');
      expect(lighten('#00000080', 20)).toBe('#14141480');
      expect(lighten('#ffffff80', 30)).toBe('#ffffff80');
    });
  });

  describe('darken', () => {
    test('darkens a color', () => {
      expect(darken('#ffffff', 10)).toBe('#f5f5f5');
      expect(darken('#ffffff', 20)).toBe('#ebebeb');
      expect(darken('#000000', 30)).toBe('#000000');
    });

    test('darkens a color with alpha', () => {
      expect(darken('#ffffff80', 10)).toBe('#f5f5f580');
    });
  });

  describe('setOpacity', () => {
    test('sets the opacity of a color', () => {
      expect(setOpacity('#000000', 0.5)).toBe('#00000080');
    });

    test('sets the opacity of a color with alpha', () => {
      expect(setOpacity('#00000000', 0.5)).toBe('#00000080');
    });
  });
});
