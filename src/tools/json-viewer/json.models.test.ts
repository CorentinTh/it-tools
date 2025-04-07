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

  describe('formatJson', () => {
    describe('repairJson', () => {
      it('repairs and formats JSON when repairJson is true', () => {
        const rawJson = '{"foo": "bar", "baz":}';
        const result = formatJson({ rawJson, sortKeys: false, repairJson: true });
        expect(result).to.equal(JSON.stringify({ foo: 'bar', baz: null }, null, 3));
      });

      it('throws an error for invalid JSON when repairJson is false', () => {
        const rawJson = '{"foo": "bar", "baz":}';
        expect(() => formatJson({ rawJson, sortKeys: false, repairJson: false })).to.throw();
      });
    });
  });
});
