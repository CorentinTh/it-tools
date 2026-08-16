import { describe, expect, it } from 'vitest';
import { detectFileSignature, finalizeCrc32, formatHexPreview, updateCrc32 } from './local-file-inspector.service';

describe('local file inspector service', () => {
  it.each([
    [new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), 'PNG image'],
    [new TextEncoder().encode('%PDF-1.7'), 'PDF document'],
    [new Uint8Array([0x7F, 0x45, 0x4C, 0x46]), 'ELF executable'],
    [new TextEncoder().encode('SQLite format 3\0'), 'SQLite database'],
  ])('detects file signatures from bounded header bytes', (bytes, name) => {
    expect(detectFileSignature(bytes).name).toBe(name);
  });

  it('computes CRC-32 incrementally using the standard check vector', () => {
    let state = 0xFFFF_FFFF;
    state = updateCrc32(state, new TextEncoder().encode('1234'));
    state = updateCrc32(state, new TextEncoder().encode('56789'));
    expect(finalizeCrc32(state)).toBe('cbf43926');
  });

  it('formats a bounded deterministic hex and ASCII preview', () => {
    expect(formatHexPreview(new Uint8Array([0x41, 0, 0x7E]))).toBe('00000000  41 00 7e                                         |A.~|');
  });
});
