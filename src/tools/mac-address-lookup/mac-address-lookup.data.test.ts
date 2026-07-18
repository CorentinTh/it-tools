import { describe, expect, it } from 'vitest';
import { decodeCompactOuiData, lookupOuiVendor } from './mac-address-lookup.data';

describe('compact OUI data', () => {
  it('decodes shared vendors and finds first, middle, and last prefixes', () => {
    const index = decodeCompactOuiData([
      [0x10, 0x10, 0x10],
      '000001000',
      ['Alpha vendor\nAddress', 'Zulu vendor'],
    ]);

    expect([...index.prefixes]).toEqual([0x10, 0x20, 0x30]);
    expect([...index.vendorIds]).toEqual([0, 1, 0]);
    expect(lookupOuiVendor(index, '000010')).toBe('Alpha vendor\nAddress');
    expect(lookupOuiVendor(index, '000020')).toBe('Zulu vendor');
    expect(lookupOuiVendor(index, '000030')).toBe('Alpha vendor\nAddress');
    expect(lookupOuiVendor(index, '000025')).toBeUndefined();
  });

  it.each([
    null,
    [],
    [[], '', []],
    [[1, 0], '000000', ['Vendor']],
    [[1], '000', ['Vendor', 'Alpha']],
    [[1], '00!', ['Vendor']],
    [[1], '001', ['Vendor']],
    [[0x1_00_00_00], '000', ['Vendor']],
  ])('fails closed for malformed compact data %#', (value) => {
    expect(() => decodeCompactOuiData(value)).toThrow(/generated OUI database is invalid/);
  });

  it('rejects malformed lookup prefixes', () => {
    const index = decodeCompactOuiData([[1], '000', ['Vendor']]);
    expect(() => lookupOuiVendor(index, '00001')).toThrow(/six upper-case/);
    expect(() => lookupOuiVendor(index, '00000a')).toThrow(/six upper-case/);
  });
});
