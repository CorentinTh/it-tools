import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
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
    const testJson = '{"b": 2, "a": 1}';
    const expectedSorted = '{\n   "a": 1,\n   "b": 2\n}';
    const expectedUnsorted = '{\n   "b": 2,\n   "a": 1\n}';

    it('formats JSON with default options (sorted keys, 3 spaces)', () => {
      const result = formatJson({ rawJson: testJson });
      expect(result).toBe(expectedSorted);
    });

    it('formats JSON without sorting keys when sortKeys is false', () => {
      const result = formatJson({ rawJson: testJson, sortKeys: false });
      expect(result).toBe(expectedUnsorted);
    });

    it('formats JSON with custom indent size', () => {
      const result = formatJson({ rawJson: testJson, indentSize: 2 });
      const expected = '{\n  "a": 1,\n  "b": 2\n}';
      expect(result).toBe(expected);
    });

    it('works with reactive refs', () => {
      const rawJsonRef = ref(testJson);
      const sortKeysRef = ref(true);
      const indentSizeRef = ref(3);

      const result = formatJson({
        rawJson: rawJsonRef,
        sortKeys: sortKeysRef,
        indentSize: indentSizeRef,
      });
      expect(result).toBe(expectedSorted);
    });

    describe('autoUnescape functionality', () => {
      it('unescapes escaped JSON strings when autoUnescape is true', () => {
        const escapedJson = '"{\\\"id\\\":\\\"123\\\",\\\"name\\\":\\\"test\\\"}"';
        const result = formatJson({ rawJson: escapedJson, autoUnescape: true, indentSize: 2 });
        const expected = '{\n  "id": "123",\n  "name": "test"\n}';
        expect(result).toBe(expected);
      });

      it('handles escaped JSON without outer quotes', () => {
        const escapedJson = '{\\\"id\\\":\\\"123\\\",\\\"name\\\":\\\"test\\\"}';
        const result = formatJson({ rawJson: escapedJson, autoUnescape: true, indentSize: 2 });
        const expected = '{\n  "id": "123",\n  "name": "test"\n}';
        expect(result).toBe(expected);
      });

      it('unescapes various escape sequences', () => {
        const escapedJson = '{\\\"text\\\":\\\"Hello\\\\\\\\World\\\",\\\"path\\\":\\\"/api\\\\/test\\\"}';
        const result = formatJson({ rawJson: escapedJson, autoUnescape: true, indentSize: 2 });
        const expected = '{\n  "path": "/api/test",\n  "text": "Hello\\\\World"\n}';
        expect(result).toBe(expected);
      });

      it('handles single-quoted outer strings', () => {
        const escapedJson = '\'{\\\"id\\\":\\\"123\\\"}\'';
        const result = formatJson({ rawJson: escapedJson, autoUnescape: true, indentSize: 2 });
        const expected = '{\n  "id": "123"\n}';
        expect(result).toBe(expected);
      });

      it('processes regular JSON normally when autoUnescape is false', () => {
        const normalJson = '{"id":"123","name":"test"}';
        const result = formatJson({ rawJson: normalJson, autoUnescape: false, indentSize: 2 });
        const expected = '{\n  "id": "123",\n  "name": "test"\n}';
        expect(result).toBe(expected);
      });

      it('handles malformed escaped JSON gracefully', () => {
        const malformedJson = '"{\\\"incomplete';
        // Should fall back to original string and fail parsing
        expect(() => formatJson({ rawJson: malformedJson, autoUnescape: true })).toThrow();
      });

      it('works with complex nested objects', () => {
        const complexEscaped = '"{\\\"users\\\":[{\\\"id\\\":\\\"1\\\",\\\"data\\\":{\\\"active\\\":true}}],\\\"meta\\\":{\\\"total\\\":1}}"';
        const result = formatJson({ rawJson: complexEscaped, autoUnescape: true, indentSize: 2 });
        const expected = '{\n  "meta": {\n    "total": 1\n  },\n  "users": [\n    {\n      "data": {\n        "active": true\n      },\n      "id": "1"\n    }\n  ]\n}';
        expect(result).toBe(expected);
      });

      it('works with reactive autoUnescape ref', () => {
        const escapedJson = '"{\\\"test\\\":\\\"value\\\"}"';
        const autoUnescapeRef = ref(true);
        const result = formatJson({ rawJson: escapedJson, autoUnescape: autoUnescapeRef, indentSize: 2 });
        const expected = '{\n  "test": "value"\n}';
        expect(result).toBe(expected);
      });
    });

    it('handles empty string input', () => {
      expect(() => formatJson({ rawJson: '' })).toThrow();
    });

    it('handles invalid JSON input', () => {
      expect(() => formatJson({ rawJson: 'invalid json' })).toThrow();
    });
  });
});
