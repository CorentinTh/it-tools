import { describe, expect, it } from 'vitest';
import { assessLicenseCombination, searchCommonLicenses } from './spdx-license-guidance.service';

describe('SPDX license guidance', () => {
  it('searches the disclosed curated subset deterministically', () => {
    expect(searchCommonLicenses('apache').map(item => item.id)).toEqual(['Apache-2.0']);
    expect(searchCommonLicenses('strong-copyleft').length).toBe(4);
  });

  it('flags the well-known Apache-2.0 and GPL-2.0-only combined-work conflict', () => {
    expect(assessLicenseCombination('GPL-2.0-only', ['Apache-2.0'])).toEqual([
      expect.objectContaining({ level: 'conflict' }),
    ]);
  });

  it('does not overstate unknown or family-level results as legal compatibility', () => {
    expect(assessLicenseCombination('MIT', ['AGPL-3.0-only', 'Custom-Proprietary'])).toEqual([
      expect.objectContaining({ level: 'review' }),
      expect.objectContaining({ level: 'unknown' }),
    ]);
  });

  it('bounds dependency count and identifier length before rendering guidance', () => {
    expect(() => assessLicenseCombination('MIT', Array.from({ length: 101 }, (_, index) => `License-${index}`))).toThrow('At most 100');
    expect(() => assessLicenseCombination('MIT', ['x'.repeat(101)])).toThrow('must not exceed 100');
  });
});
