import { describe, expect, it } from 'vitest';
import { convertDataSize } from './data-size-converter.models';

describe('data-size-converter', () => {
  it('converts within the same unit', () => {
    expect(convertDataSize({ value: 42, from: 'MB', to: 'MB', base: 1000 })).toBe(42);
  });

  it('converts with decimal (SI) base 1000', () => {
    expect(convertDataSize({ value: 1, from: 'KB', to: 'B', base: 1000 })).toBe(1000);
    expect(convertDataSize({ value: 1, from: 'GB', to: 'MB', base: 1000 })).toBe(1000);
    expect(convertDataSize({ value: 1500, from: 'B', to: 'KB', base: 1000 })).toBeCloseTo(1.5);
  });

  it('converts with binary base 1024', () => {
    expect(convertDataSize({ value: 1, from: 'KB', to: 'B', base: 1024 })).toBe(1024);
    expect(convertDataSize({ value: 2048, from: 'B', to: 'KB', base: 1024 })).toBe(2);
    expect(convertDataSize({ value: 1, from: 'TB', to: 'GB', base: 1024 })).toBe(1024);
  });

  it('converts across distant units', () => {
    expect(convertDataSize({ value: 1, from: 'PB', to: 'KB', base: 1000 })).toBe(1e12);
    expect(convertDataSize({ value: 1, from: 'B', to: 'PB', base: 1000 })).toBeCloseTo(1e-12);
  });

  it('handles zero and negative values', () => {
    expect(convertDataSize({ value: 0, from: 'GB', to: 'MB', base: 1024 })).toBe(0);
    expect(convertDataSize({ value: -1, from: 'GB', to: 'MB', base: 1000 })).toBe(-1000);
  });
});
