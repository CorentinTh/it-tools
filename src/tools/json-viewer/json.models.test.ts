import { describe, expect, it } from 'vitest';
import { formatJson, sortObjectKeys } from './json.models';

describe('json models', () => {
  describe('sortObjectKeys', () => {
    it('the object keys are recursively sorted alphabetically', () => {
      expect(JSON.stringify(sortObjectKeys({ b: 2, a: 1 }))).to.deep.equal(JSON.stringify({ a: 1, b: 2 }));
      // To unsure that this way of testing is working
      expect(JSON.stringify(sortObjectKeys({ b: 2, a: 1 }))).to.not.deep.equal(JSON.stringify({ b: 2, a: 1 }));

      expect(JSON.stringify(sortObjectKeys({ b: 2, a: 1, d: { j: 7, a: [{ z: 9, y: 8 }] }, c: 3 }))).to.deep.equal(
        JSON.stringify({ a: 1, b: 2, c: 3, d: { a: [{ y: 8, z: 9 }], j: 7 } }),
      );
    });
  });
});

describe('big number precision (#1615)', () => {
  it('preserves integers beyond Number.MAX_SAFE_INTEGER', () => {
    const input = '{"id": 12345678901234567890}';
    const output = formatJson({ rawJson: input, sortKeys: false });
    expect(output).toContain('12345678901234567890');
  });

  it('keeps normal numbers as numbers', () => {
    const output = formatJson({ rawJson: '{"n": 42, "f": 1.5}', sortKeys: false });
    expect(output).toContain('"n": 42');
    expect(output).toContain('"f": 1.5');
  });

  it('handles arrays of big ids', () => {
    const output = formatJson({ rawJson: '{"ids":[123456789012345678,987654321098765432]}', sortKeys: false });
    expect(output).toContain('123456789012345678');
    expect(output).toContain('987654321098765432');
  });
});
