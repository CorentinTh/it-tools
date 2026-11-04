import { describe, expect, it } from 'vitest';
import {
  clampQuality,
  convertImage,
  formatSizeDelta,
  getDefaultFileName,
  getFileExtension,
  getImageFromDataTransfer,
  getTypeLabel,
  getUniqueFileName,
  isFallbackOutput,
  isOutputFormat,
} from './paste-image.service';

function createDataTransfer(items: { kind: string; type: string; file?: File }[]) {
  return {
    items: items.map(({ kind, type, file }) => ({ kind, type, getAsFile: () => file ?? null })),
  } as unknown as DataTransfer;
}

describe('paste-image', () => {
  describe('isOutputFormat', () => {
    it('accepts only the supported output formats', () => {
      expect(isOutputFormat('png')).toBe(true);
      expect(isOutputFormat('jpeg')).toBe(true);
      expect(isOutputFormat('webp')).toBe(true);
      expect(isOutputFormat('gif')).toBe(false);
      expect(isOutputFormat('toString')).toBe(false);
      expect(isOutputFormat(undefined)).toBe(false);
    });
  });

  describe('clampQuality', () => {
    it('keeps the quality between 1 and 100', () => {
      expect(clampQuality(75)).toBe(75);
      expect(clampQuality(0)).toBe(1);
      expect(clampQuality(150)).toBe(100);
      expect(clampQuality(42.6)).toBe(43);
    });

    it('falls back to the default quality for invalid values', () => {
      expect(clampQuality('abc')).toBe(90);
      expect(clampQuality(Number.NaN)).toBe(90);
    });
  });

  describe('getDefaultFileName', () => {
    it('builds a sortable file name from the date', () => {
      expect(getDefaultFileName({ date: new Date(2026, 10, 4, 9, 5, 7) })).toBe('pasted-image-20261104-090507');
    });
  });

  describe('getUniqueFileName', () => {
    it('keeps a file name that is not taken', () => {
      expect(getUniqueFileName({ fileName: 'image', existingFileNames: ['other'] })).toBe('image');
    });

    it('adds the first free numeric suffix to a taken file name', () => {
      expect(getUniqueFileName({ fileName: 'image', existingFileNames: ['image'] })).toBe('image-2');
      expect(getUniqueFileName({ fileName: 'image', existingFileNames: ['image', 'image-2', 'image-3'] })).toBe('image-4');
    });
  });

  describe('getFileExtension', () => {
    it('maps image mime types to their usual extension', () => {
      expect(getFileExtension('image/png')).toBe('png');
      expect(getFileExtension('image/jpeg')).toBe('jpg');
      expect(getFileExtension('image/webp')).toBe('webp');
      expect(getFileExtension('image/svg+xml')).toBe('svg');
    });

    it('falls back to the mime subtype for unknown image types', () => {
      expect(getFileExtension('image/x-unknown+xml')).toBe('x-unknown');
    });
  });

  describe('getTypeLabel', () => {
    it('uses the output format label, or the upper-case extension for other types', () => {
      expect(getTypeLabel('image/jpeg')).toBe('JPEG');
      expect(getTypeLabel('image/webp')).toBe('WebP');
      expect(getTypeLabel('image/gif')).toBe('GIF');
    });
  });

  describe('isFallbackOutput', () => {
    it('detects an output that the browser encoded in another format', () => {
      expect(isFallbackOutput({ output: new Blob([], { type: 'image/png' }), format: 'webp' })).toBe(true);
      expect(isFallbackOutput({ output: new Blob([], { type: 'image/webp' }), format: 'webp' })).toBe(false);
    });
  });

  describe('formatSizeDelta', () => {
    it('formats the size change in percent with a sign', () => {
      expect(formatSizeDelta({ originalSize: 1000, outputSize: 250 })).toBe('-75%');
      expect(formatSizeDelta({ originalSize: 1000, outputSize: 1500 })).toBe('+50%');
      expect(formatSizeDelta({ originalSize: 1000, outputSize: 1000 })).toBe('0%');
      expect(formatSizeDelta({ originalSize: 0, outputSize: 1500 })).toBe('0%');
    });
  });

  describe('getImageFromDataTransfer', () => {
    it('returns the first image file of the clipboard data', () => {
      const image = new File(['image'], 'image.png', { type: 'image/png' });
      const dataTransfer = createDataTransfer([
        { kind: 'string', type: 'text/plain' },
        { kind: 'file', type: 'image/png', file: image },
      ]);

      expect(getImageFromDataTransfer(dataTransfer)).toBe(image);
    });

    it('returns undefined when the clipboard data has no image', () => {
      const dataTransfer = createDataTransfer([
        { kind: 'string', type: 'text/plain' },
        { kind: 'file', type: 'application/pdf', file: new File(['pdf'], 'doc.pdf', { type: 'application/pdf' }) },
      ]);

      expect(getImageFromDataTransfer(dataTransfer)).toBeUndefined();
      expect(getImageFromDataTransfer(null)).toBeUndefined();
    });
  });

  describe('convertImage', () => {
    it('keeps the original bytes when a PNG image is converted to PNG', async () => {
      const source = new Blob(['png'], { type: 'image/png' });

      expect(await convertImage({ source, format: 'png', quality: 90 })).toBe(source);
    });
  });
});
