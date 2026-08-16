import { Blob as NodeBlob } from 'node:buffer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { blobToUtf8, decodeGzipBase64, encodeGzipBase64, gzipStreamsAvailable, textToBoundedBlob, transformGzip } from './gzip-converter.service';

describe('GZIP converter', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('round trips Unicode through native streaming compression', async () => {
    if (!gzipStreamsAvailable()) {
      return;
    }
    vi.stubGlobal('Blob', NodeBlob);
    const compressed = await transformGzip(textToBoundedBlob('hello 🌍\n'.repeat(100)), 'compress');
    expect(compressed.byteLength).toBeLessThan(200);
    const decompressed = await transformGzip(compressed.blob, 'decompress');
    expect(await blobToUtf8(decompressed.blob)).toBe('hello 🌍\n'.repeat(100));
  });

  it('uses canonical Base64 and rejects malformed input', () => {
    const encoded = encodeGzipBase64(Uint8Array.from([31, 139, 8, 0]));
    expect([...decodeGzipBase64(encoded)]).toEqual([31, 139, 8, 0]);
    expect(() => decodeGzipBase64('%%%')).toThrow(/valid standard Base64/u);
  });

  it('enforces the text input bound before stream allocation', () => {
    expect(() => textToBoundedBlob('x'.repeat(1024 * 1024 + 1))).toThrow(/1 MiB/u);
  });
});
