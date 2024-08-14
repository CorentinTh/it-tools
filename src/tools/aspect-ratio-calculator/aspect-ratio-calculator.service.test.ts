// aspect-ratio-calculator.service.test.ts

import { describe, expect, it } from 'vitest';
import {
  type AspectRatio,
  calculateAspectRatio,
  calculateDimensions,
  simplifyRatio,
} from './aspect-ratio-calculator.service';

describe('Aspect Ratio Calculator Service', () => {
  describe('calculateAspectRatio', () => {
    it('calculates correct aspect ratio for 1920x1080', () => {
      const result = calculateAspectRatio(1920, 1080);
      expect(result).toEqual({ r1: 16, r2: 9 });
    });

    it('calculates correct aspect ratio for 640x480', () => {
      const result = calculateAspectRatio(640, 480);
      expect(result).toEqual({ r1: 4, r2: 3 });
    });

    it('handles square aspect ratio', () => {
      const result = calculateAspectRatio(1000, 1000);
      expect(result).toEqual({ r1: 1, r2: 1 });
    });
  });

  describe('calculateDimensions', () => {
    it('calculates correct height given width and 16:9 ratio', () => {
      const ratio: AspectRatio = { r1: 16, r2: 9 };
      const result = calculateDimensions(1920, ratio, true);
      expect(result).toEqual({ width: 1920, height: 1080 });
    });

    it('calculates correct width given height and 4:3 ratio', () => {
      const ratio: AspectRatio = { r1: 4, r2: 3 };
      const result = calculateDimensions(480, ratio, false);
      expect(result).toEqual({ width: 640, height: 480 });
    });

    it('handles 1:1 ratio', () => {
      const ratio: AspectRatio = { r1: 1, r2: 1 };
      const result = calculateDimensions(500, ratio, true);
      expect(result).toEqual({ width: 500, height: 500 });
    });
  });

  describe('simplifyRatio', () => {
    it('simplifies 16:9 ratio', () => {
      const result = simplifyRatio(16, 9);
      expect(result).toEqual({ r1: 16, r2: 9 });
    });

    it('simplifies 1920:1080 to 16:9', () => {
      const result = simplifyRatio(1920, 1080);
      expect(result).toEqual({ r1: 16, r2: 9 });
    });

    it('simplifies 4:2 to 2:1', () => {
      const result = simplifyRatio(4, 2);
      expect(result).toEqual({ r1: 2, r2: 1 });
    });

    it('handles already simplified ratios', () => {
      const result = simplifyRatio(7, 5);
      expect(result).toEqual({ r1: 7, r2: 5 });
    });
  });
});
