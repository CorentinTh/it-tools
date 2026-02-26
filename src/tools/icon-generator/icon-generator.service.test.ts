import { describe, expect, it } from 'vitest';
import {
  ICON_PRESETS,
  buildIconFilename,
  calculateDrawArea,
  createWebAppManifest,
  getPresetSizes,
  normalizeSizes,
  sanitizeBaseName,
} from './icon-generator.service';

describe('icon-generator', () => {
  describe('normalizeSizes', () => {
    it('should remove invalid values and deduplicate sizes', () => {
      expect(normalizeSizes([192, 192, 0, -1, 512.8, 72])).toEqual([72, 192, 512]);
    });
  });

  describe('getPresetSizes', () => {
    it('should return merged and sorted sizes from multiple presets', () => {
      const sizes = getPresetSizes(['pwa', 'android']);

      expect(sizes).toEqual([48, 72, 96, 128, 144, 152, 192, 384, 512]);
    });

    it('should include known iOS size', () => {
      const sizes = getPresetSizes(['ios']);
      expect(sizes).toContain(180);
      expect(sizes).toContain(1024);
    });
  });

  describe('calculateDrawArea', () => {
    it('should crop in cover mode for rectangular source', () => {
      const drawArea = calculateDrawArea({
        sourceWidth: 400,
        sourceHeight: 200,
        targetSize: 100,
        fitMode: 'cover',
      });

      expect(drawArea.width).toBeGreaterThan(100);
      expect(drawArea.height).toBe(100);
      expect(drawArea.x).toBeLessThan(0);
    });

    it('should keep full image in contain mode for rectangular source', () => {
      const drawArea = calculateDrawArea({
        sourceWidth: 400,
        sourceHeight: 200,
        targetSize: 100,
        fitMode: 'contain',
      });

      expect(drawArea.width).toBe(100);
      expect(drawArea.height).toBeLessThan(100);
      expect(drawArea.y).toBeGreaterThan(0);
    });
  });

  it('should expose 3 platform presets', () => {
    expect(ICON_PRESETS.map(preset => preset.key)).toEqual(['pwa', 'android', 'ios']);
  });

  it('should sanitize base name and use it in icon filename', () => {
    expect(sanitizeBaseName(' My App/Icon ')).toBe('My-App-Icon');
    expect(buildIconFilename(192, ' My App/Icon ')).toBe('My-App-Icon-192x192.png');
    expect(buildIconFilename(192, '   ')).toBe('icon-192x192.png');
  });

  it('should create manifest json with provided icons', () => {
    const manifestJson = createWebAppManifest({
      appName: 'my-app',
      description: 'my generated icons',
      icons: [
        { filename: 'my-app-192x192.png', size: 192 },
        { filename: 'my-app-512x512.png', size: 512 },
      ],
    });

    const manifest = JSON.parse(manifestJson) as {
      id: string
      name: string
      short_name: string
      description: string
      lang: string
      start_url: string
      scope: string
      icons: { src: string; sizes: string; type: string; purpose: string }[]
    };
    expect(manifest.id).toBe('/');
    expect(manifest.name).toBe('my-app');
    expect(manifest.short_name).toBe('my-app');
    expect(manifest.description).toBe('my generated icons');
    expect(manifest.lang).toBe('en');
    expect(manifest.start_url).toBe('/');
    expect(manifest.scope).toBe('/');
    expect(manifest.icons).toEqual([
      { src: 'my-app-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: 'my-app-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ]);
  });
});
