import { describe, expect, it } from 'vitest';
import { FAVICON_SIZES, buildIcoBuffer, generateSiteWebmanifest } from './favicon-generator.service';

describe('generateSiteWebmanifest', () => {
  it('produces valid JSON', () => {
    const result = generateSiteWebmanifest();
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('uses the provided app name', () => {
    const manifest = JSON.parse(generateSiteWebmanifest('Acme'));
    expect(manifest.name).toBe('Acme');
    expect(manifest.short_name).toBe('Acme');
  });

  it('includes 192x192 and 512x512 icon entries', () => {
    const manifest = JSON.parse(generateSiteWebmanifest());
    const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
  });

  it('sets display to standalone', () => {
    const manifest = JSON.parse(generateSiteWebmanifest());
    expect(manifest.display).toBe('standalone');
  });
});

function fakeBuffer(size: number): ArrayBuffer {
  return new Uint8Array(size).buffer;
}

describe('buildIcoBuffer', () => {
  it('starts with ICO magic bytes (reserved=0, type=1)', () => {
    const buf = buildIcoBuffer([fakeBuffer(4), fakeBuffer(4)], [16, 32]);
    const view = new DataView(buf);
    expect(view.getUint16(0, true)).toBe(0);
    expect(view.getUint16(2, true)).toBe(1);
  });

  it('writes correct image count', () => {
    const buf = buildIcoBuffer([fakeBuffer(4), fakeBuffer(4), fakeBuffer(4)], [16, 32, 48]);
    const view = new DataView(buf);
    expect(view.getUint16(4, true)).toBe(3);
  });

  it('embeds png data after directory entries', () => {
    const pngData = new Uint8Array([1, 2, 3, 4]);
    const buf = buildIcoBuffer([pngData.buffer], [16]);
    const view = new DataView(buf);
    const dataOffset = view.getUint32(6 + 12, true);
    const embedded = new Uint8Array(buf, dataOffset, 4);
    expect(Array.from(embedded)).toEqual([1, 2, 3, 4]);
  });

  it('records correct byte size in directory entry', () => {
    const buf = buildIcoBuffer([fakeBuffer(100)], [32]);
    const view = new DataView(buf);
    expect(view.getUint32(6 + 8, true)).toBe(100);
  });

  it('total size equals header + dir entries + all png data', () => {
    const sizes = [16, 32, 48];
    const pngBuffers = [fakeBuffer(10), fakeBuffer(20), fakeBuffer(30)];
    const buf = buildIcoBuffer(pngBuffers, sizes);
    const expected = 6 + 16 * 3 + 10 + 20 + 30;
    expect(buf.byteLength).toBe(expected);
  });
});

describe('FAVICON_SIZES', () => {
  it('includes all required sizes', () => {
    const sizes = FAVICON_SIZES.map(s => s.size);
    expect(sizes).toContain(16);
    expect(sizes).toContain(32);
    expect(sizes).toContain(48);
    expect(sizes).toContain(180);
    expect(sizes).toContain(192);
    expect(sizes).toContain(512);
  });

  it('maps 180 to apple-touch-icon.png', () => {
    const entry = FAVICON_SIZES.find(s => s.size === 180);
    expect(entry?.filename).toBe('apple-touch-icon.png');
  });

  it('maps 16 to favicon-16x16.png', () => {
    const entry = FAVICON_SIZES.find(s => s.size === 16);
    expect(entry?.filename).toBe('favicon-16x16.png');
  });

  it('maps 32 to favicon-32x32.png', () => {
    const entry = FAVICON_SIZES.find(s => s.size === 32);
    expect(entry?.filename).toBe('favicon-32x32.png');
  });
});
