import { describe, expect, it } from 'vitest';
import { generateCSSOutput } from './border-generator.service';
import type { Borders } from './border-generator.service';

describe('border-generator service', () => {
  describe('generateCSSOutput', () => {
    it('generates correct CSS with default values', () => {
      const borders: Borders = {
        topLeft: { label: 'Top Left', value: 10, max: 100 },
        topRight: { label: 'Top Right', value: 10, max: 100 },
        bottomRight: { label: 'Bottom Right', value: 10, max: 100 },
        bottomLeft: { label: 'Bottom Left', value: 10, max: 100 },
      };

      const cssOutput = generateCSSOutput(borders, 1, 'solid', 'px');

      expect(cssOutput).toEqual('border: 1px solid #000000; border-radius: 10px 10px 10px 10px;');
    });

    it('generates correct CSS with custom values', () => {
      const borders: Borders = {
        topLeft: { label: 'Top Left', value: 20, max: 100 },
        topRight: { label: 'Top Right', value: 15, max: 100 },
        bottomRight: { label: 'Bottom Right', value: 5, max: 100 },
        bottomLeft: { label: 'Bottom Left', value: 25, max: 100 },
      };

      const cssOutput = generateCSSOutput(borders, 2, 'dashed', '%');

      expect(cssOutput).toEqual('border: 2px dashed #000000; border-radius: 20% 15% 5% 25%;');
    });

    it('throws an error when borders are missing', () => {
      const borders = {} as Borders;

      expect(() => generateCSSOutput(borders, 1, 'solid', 'px')).toThrowError();
    });
  });
});
