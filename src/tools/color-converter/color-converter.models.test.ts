import { describe, expect, it } from 'vitest';
import { removeAlphaChannelWhenOpaque } from './color-converter.models';

describe('color-converter models', () => {
  describe('removeAlphaChannelWhenOpaque', () => {
    it('remove alpha channel of an hex color when it is opaque (alpha = 1)', () => {
      expect(removeAlphaChannelWhenOpaque('#000000ff')).toBe('#000000');
      expect(removeAlphaChannelWhenOpaque('#ffffffFF')).toBe('#ffffff');
      expect(removeAlphaChannelWhenOpaque('#000000FE')).toBe('#000000FE');
      expect(removeAlphaChannelWhenOpaque('#00000000')).toBe('#00000000');
    });
  });
});
