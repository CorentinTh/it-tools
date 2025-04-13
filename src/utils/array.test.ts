import { describe, expect, it } from 'vitest';
import { type SortOrder, byOrder } from './array';

describe('array utils', () => {
  describe('byOrder', () => {
    it('should sort correctly', () => {
      const sortBy = (array: string[], order: SortOrder) => {
        return array.sort(byOrder({ order }));
      };

      const strings = ['a', 'A', 'b', 'B', 'á', '1', '2', '10', '一', '阿'];

      expect(sortBy(strings, null)).to.eql(strings);
      expect(sortBy(strings, undefined)).to.eql(strings);
      expect(sortBy(strings, 'asc')).to.eql(['1', '10', '2', 'a', 'A', 'á', 'b', 'B', '一', '阿']);
      expect(sortBy(strings, 'asc-num')).to.eql(['1', '2', '10', 'a', 'A', 'á', 'b', 'B', '一', '阿']);
      expect(sortBy(strings, 'asc-bin')).to.eql(['1', '10', '2', 'A', 'B', 'a', 'b', 'á', '一', '阿']);
      expect(sortBy(strings, 'asc-upper')).to.eql(['1', '10', '2', 'A', 'a', 'á', 'B', 'b', '一', '阿']);
      expect(sortBy(strings, 'desc')).to.eql(['阿', '一', 'B', 'b', 'á', 'A', 'a', '2', '10', '1']);
      expect(sortBy(strings, 'desc-num')).to.eql(['阿', '一', 'B', 'b', 'á', 'A', 'a', '10', '2', '1']);
      expect(sortBy(strings, 'desc-bin')).to.eql(['阿', '一', 'á', 'b', 'a', 'B', 'A', '2', '10', '1']);
      expect(sortBy(strings, 'desc-upper')).to.eql(['阿', '一', 'b', 'B', 'á', 'a', 'A', '2', '10', '1']);
    });
  });
});
