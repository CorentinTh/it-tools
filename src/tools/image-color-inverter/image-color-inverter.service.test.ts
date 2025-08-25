import { describe, expect, it } from 'vitest';
import { invertImageColors } from './image-color-inverter.service';

// Mock ImageData for Node.js environment
Object.defineProperty(globalThis, 'ImageData', {
  value: class ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;

    constructor(data: Uint8ClampedArray | number, width: number, height?: number) {
      if (typeof data === 'number') {
        // ImageData(width, height)
        this.width = data;
        this.height = width;
        this.data = new Uint8ClampedArray(data * width * 4);
      }
      else {
        // ImageData(data, width, height)
        this.data = data;
        this.width = width;
        this.height = height || data.length / (width * 4);
      }
    }
  },
});

// Mock other browser APIs for completeness
Object.defineProperty(globalThis, 'HTMLCanvasElement', {
  value: class {
    width = 0;
    height = 0;

    getContext() {
      return {
        drawImage: () => {},
        getImageData: () => new (globalThis as any).ImageData(new Uint8ClampedArray([255, 0, 128, 255]), 1, 1),
        putImageData: () => {},
      };
    }

    toDataURL() {
      return 'data:image/png;base64,mock';
    }
  },
});

Object.defineProperty(globalThis, 'Image', {
  value: class {
    onload: () => void = () => {};
    onerror: () => void = () => {};
    width = 100;
    height = 100;

    set src(value: string) {
      setTimeout(() => this.onload(), 0);
    }

    get src(): string {
      return '';
    }
  },
});

describe('image-color-inverter service', () => {
  describe('invertImageColors', () => {
    it('should invert RGB colors while preserving alpha', () => {
      // Create test image data with known values
      const originalData = new Uint8ClampedArray([
        255,
        0,
        128,
        255, // Red=255, Green=0, Blue=128, Alpha=255
        0,
        255,
        64,
        128, // Red=0, Green=255, Blue=64, Alpha=128
      ]);
      const imageData = new (globalThis as any).ImageData(originalData, 2, 1);

      const inverted = invertImageColors(imageData);

      // Check that colors are inverted correctly
      expect(inverted.data[0]).toBe(0); // 255 - 255 = 0
      expect(inverted.data[1]).toBe(255); // 255 - 0 = 255
      expect(inverted.data[2]).toBe(127); // 255 - 128 = 127
      expect(inverted.data[3]).toBe(255); // Alpha unchanged

      expect(inverted.data[4]).toBe(255); // 255 - 0 = 255
      expect(inverted.data[5]).toBe(0); // 255 - 255 = 0
      expect(inverted.data[6]).toBe(191); // 255 - 64 = 191
      expect(inverted.data[7]).toBe(128); // Alpha unchanged
    });

    it('should preserve image dimensions', () => {
      const originalData = new Uint8ClampedArray([255, 0, 128, 255]);
      const imageData = new (globalThis as any).ImageData(originalData, 1, 1);

      const inverted = invertImageColors(imageData);

      expect(inverted.width).toBe(1);
      expect(inverted.height).toBe(1);
    });

    it('should handle pure black and white pixels', () => {
      const originalData = new Uint8ClampedArray([
        0,
        0,
        0,
        255, // Pure black
        255,
        255,
        255,
        255, // Pure white
      ]);
      const imageData = new (globalThis as any).ImageData(originalData, 2, 1);

      const inverted = invertImageColors(imageData);

      // Black should become white
      expect(inverted.data[0]).toBe(255);
      expect(inverted.data[1]).toBe(255);
      expect(inverted.data[2]).toBe(255);
      expect(inverted.data[3]).toBe(255);

      // White should become black
      expect(inverted.data[4]).toBe(0);
      expect(inverted.data[5]).toBe(0);
      expect(inverted.data[6]).toBe(0);
      expect(inverted.data[7]).toBe(255);
    });
  });
});
