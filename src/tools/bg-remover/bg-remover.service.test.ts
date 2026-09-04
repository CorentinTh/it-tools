import { describe, expect, it } from 'vitest';
import { applyMaskToImageData } from './bg-remover.service';

describe('bg-remover', () => {
  describe('applyMaskToImageData', () => {
    it('writes the mask values into the alpha channel of each pixel', () => {
      const imageData = Uint8ClampedArray.from([
        255, 0, 0, 255,
        0, 255, 0, 255,
      ]);
      const maskData = Uint8ClampedArray.from([255, 0]);

      applyMaskToImageData({ imageData, maskData });

      expect(Array.from(imageData)).toEqual([
        255, 0, 0, 255,
        0, 255, 0, 0,
      ]);
    });
  });
});
