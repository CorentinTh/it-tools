import { describe, expect, it } from 'vitest';
import { compareLists } from './list-comparison.service';

const base = { trimItems: true, ignoreCase: false, ignoreEmpty: true };

describe('list comparison', () => {
  it('compares sets while preserving first display values', () => {
    const result = compareLists({ ...base, mode: 'set', left: 'Alpha\nBeta\nBeta', right: 'Beta\nGamma' });
    expect(result).toContain('Left: 3 lines / 2 unique');
    expect(result).toContain('Only in left (1)\nAlpha');
    expect(result).toContain('In both (1)\nBeta');
  });

  it('preserves duplicate counts in multiset mode and supports normalized case', () => {
    const result = compareLists({ ...base, ignoreCase: true, mode: 'multiset', left: 'A\na\na\nb', right: 'a\nb\nb' });
    expect(result).toContain('Excess in left (1)\nA × 2');
    expect(result).toContain('Excess in right (1)\nb × 1');
    expect(result).toContain('Matched copies (2)');
  });

  it('produces an ordered LCS report and rejects excessive alignment work', () => {
    expect(compareLists({ ...base, mode: 'ordered', left: 'a\nb\nc', right: 'a\nc\nd' })).toContain('  a\n- b\n  c\n+ d');
    const large = Array.from({ length: 501 }, (_, index) => String(index)).join('\n');
    expect(() => compareLists({ ...base, mode: 'ordered', left: large, right: large })).toThrow(/250,000 alignment cells/u);
  });
});
