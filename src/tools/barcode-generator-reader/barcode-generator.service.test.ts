import { describe, expect, it } from 'vitest';
import { calculateEanCheckDigit, encodeBarcode, renderBarcodeSvg } from './barcode-generator.service';

describe('barcode generation', () => {
  it('calculates and validates standard EAN-13 checksums', () => {
    expect(calculateEanCheckDigit('590123412345')).toBe(7);
    const encoded = encodeBarcode('590123412345', 'ean13');
    expect(encoded.normalizedValue).toBe('5901234123457');
    expect(encoded.modules).toHaveLength(95);
    expect(encoded.modules).toMatch(/^101[01]+01010[01]+101$/);
    expect(encodeBarcode('5901234123457', 'ean13')).toEqual(encoded);
    expect(() => encodeBarcode('5901234123458', 'ean13')).toThrow(/expected 7/);
  });

  it('normalizes UPC-A through its equivalent leading-zero EAN representation', () => {
    expect(calculateEanCheckDigit('03600029145')).toBe(2);
    const upc = encodeBarcode('03600029145', 'upca');
    const ean = encodeBarcode('0036000291452', 'ean13');
    expect(upc.normalizedValue).toBe('036000291452');
    expect(upc.modules).toBe(ean.modules);
  });

  it('encodes Code 128 subset B with start, weighted checksum, and stop patterns', () => {
    const encoded = encodeBarcode('A', 'code128');
    expect(encoded.modules).toHaveLength(46);
    expect(encoded.modules.startsWith('11010010000')).toBe(true);
    expect(encoded.modules.endsWith('1100011101011')).toBe(true);
    expect(() => encodeBarcode('\n', 'code128')).toThrow(/printable ASCII/);
    expect(() => encodeBarcode('x'.repeat(121), 'code128')).toThrow(/1–120/);
  });

  it('renders standalone SVG with merged bars and escaped human-readable text', () => {
    const svg = renderBarcodeSvg(encodeBarcode('<tag>', 'code128'));
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('<rect');
    expect(svg).toContain('&lt;tag&gt;');
    expect(svg).not.toContain('><tag><');
    expect(() => renderBarcodeSvg(encodeBarcode('A', 'code128'), 0)).toThrow(/dimensions/);
  });
});
