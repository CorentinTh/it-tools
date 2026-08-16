import { describe, expect, it } from 'vitest';
import { stripImageMetadata } from './image-metadata-remover.service';

function ascii(value: string): number[] {
  return [...value].map(character => character.charCodeAt(0));
}

function pngChunk(type: string, data: number[]): number[] {
  const length = data.length;
  return [length >>> 24, length >>> 16 & 0xFF, length >>> 8 & 0xFF, length & 0xFF, ...ascii(type), ...data, 0, 0, 0, 0];
}

function webpChunk(type: string, data: number[]): number[] {
  const length = data.length;
  return [...ascii(type), length & 0xFF, length >>> 8 & 0xFF, length >>> 16 & 0xFF, length >>> 24, ...data, ...(length % 2 ? [0] : [])];
}

function webp(chunks: number[][]): Uint8Array {
  const payload = chunks.flat();
  const riffSize = payload.length + 4;
  return new Uint8Array([...ascii('RIFF'), riffSize & 0xFF, riffSize >>> 8 & 0xFF, riffSize >>> 16 & 0xFF, riffSize >>> 24, ...ascii('WEBP'), ...payload]);
}

describe('image metadata remover', () => {
  it('removes JPEG application metadata and comments without changing scan bytes', () => {
    const source = new Uint8Array([
      0xFF, 0xD8,
      0xFF, 0xE1, 0x00, 0x08, ...ascii('Exif00'),
      0xFF, 0xE2, 0x00, 0x04, 0xAA, 0xBB,
      0xFF, 0xFE, 0x00, 0x04, 0x43, 0x4D,
      0xFF, 0xDA, 0x00, 0x04, 0x01, 0x02,
      0x11, 0xFF, 0x00, 0x22,
      0xFF, 0xD9,
    ]);

    const output = stripImageMetadata(source);
    expect(output.mimeType).toBe('image/jpeg');
    expect(output.removedItems.map(item => item.type)).toEqual(['JPEG APP1', 'JPEG comment']);
    expect(Array.from(output.bytes)).toContain(0xAA);
    expect(Array.from(output.bytes.slice(-6))).toEqual([0x11, 0xFF, 0x00, 0x22, 0xFF, 0xD9]);
    expect(new TextDecoder().decode(output.bytes)).not.toContain('Exif');
  });

  it('removes PNG privacy/unknown ancillary chunks while preserving color and image chunks byte-for-byte', () => {
    const source = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      ...pngChunk('IHDR', Array.from({ length: 13 }, () => 0)),
      ...pngChunk('gAMA', [0, 0, 0xB1, 0x8F]),
      ...pngChunk('tEXt', ascii('GPS\0secret')),
      ...pngChunk('vpAg', [1, 2, 3]),
      ...pngChunk('IDAT', [0x78, 0x9C]),
      ...pngChunk('IEND', []),
    ]);

    const output = stripImageMetadata(source);
    expect(output.mimeType).toBe('image/png');
    expect(output.removedItems.map(item => item.type)).toEqual(['PNG tEXt', 'PNG vpAg']);
    expect(new TextDecoder().decode(output.bytes)).toContain('gAMA');
    expect(new TextDecoder().decode(output.bytes)).not.toContain('secret');
  });

  it('removes WebP EXIF/XMP/unknown chunks, clears VP8X flags, and repairs RIFF size', () => {
    const source = webp([
      webpChunk('VP8X', [0x0C, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      webpChunk('VP8L', [0x2F, 0]),
      webpChunk('EXIF', [1, 2, 3]),
      webpChunk('XMP ', ascii('private')),
      webpChunk('ABCD', [9]),
    ]);

    const output = stripImageMetadata(source);
    const view = new DataView(output.bytes.buffer, output.bytes.byteOffset, output.bytes.byteLength);
    expect(output.mimeType).toBe('image/webp');
    expect(output.removedItems.map(item => item.type)).toEqual(['WebP "ABCD"', 'WebP "EXIF"', 'WebP "XMP "']);
    expect(output.bytes[20]).toBe(0);
    expect(view.getUint32(4, true)).toBe(output.bytes.length - 8);
  });

  it('rejects unsupported and structurally truncated containers', () => {
    expect(() => stripImageMetadata(new Uint8Array([1, 2, 3]))).toThrow(/Only signature-verified/u);
    expect(() => stripImageMetadata(new Uint8Array([0xFF, 0xD8, 0xFF, 0xE1, 0, 20]))).toThrow(/length/u);
    expect(() => stripImageMetadata(webp([webpChunk('EXIF', [1])]))).toThrow(/no image frame/u);
  });
});
