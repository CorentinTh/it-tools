import { describe, expect, it } from 'vitest';
import { jsonToGo } from './json-to-go.service';
import testCases from './json-to-go.test.data.json';

describe('json-to-go', () => {
  describe('jsonToGo', () => {
    for (const includeExampleData of [true, false]) {
      it(`must return correct results (includeExampleData = ${includeExampleData})`, () => {
        for (const testCase of testCases) {
          const got = jsonToGo(testCase.input, '', false, includeExampleData);
          const expected = includeExampleData
            ? testCase.expectedWithExample
            : testCase.expected;

          expect(got.go).to.equal(expected);
        }
      });
    }
  });
});
