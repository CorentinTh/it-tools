import { describe, expect, it } from 'vitest';
import { compareLists } from './list-comparer.service';

describe('list-comparer', () => {
  describe('compareLists', () => {
    it('return correct comparaison', () => {
      expect(compareLists({
        list1: '1\n 2\n3\n4\n5\n4\n7\nA',
        list2: '1\n2\n3\n4\n6\n4\n7\na',
        trimItems: true,
        ignoreCase: true,
      })).to.deep.eq({
        list1Not2: [
          '5',
        ],
        list2Not1: [
          '6',
        ],
        same: [
          '1',
          '2',
          '3',
          '4',
          '7',
          'a',
        ],
      });

      expect(compareLists({
        list1: '1\n 2\n3\n4\n5\n4\n7\nA',
        list2: '1\n2\n3\n4\n6\n4\n7\na',
        trimItems: false,
        ignoreCase: false,
      })).to.deep.eq({
        list1Not2: [
          ' 2',
          '5',
          'A',
        ],
        list2Not1: [
          '2',
          '6',
          'a',
        ],
        same: [
          '1',
          '3',
          '4',
          '7',
        ],
      });

      expect(compareLists({
        list1: '1, 2,3,4,5\n4,7,A,A',
        list2: '1\n2\n3\n4\n6\n4\n7\na',
        trimItems: false,
        ignoreCase: false,
        separator: ',',
      })).to.deep.eq({
        list1Not2: [
          ' 2',
          '5',
          'A',
        ],
        list2Not1: [
          '2',
          '6',
          'a',
        ],
        same: [
          '1',
          '3',
          '4',
          '7',
        ],
      });

      expect(compareLists({
        list1: '10\n20\n20\n30',
        list2: '30\n20\n40',
        trimItems: false,
        ignoreCase: false,
      })).to.deep.eq({
        list1Not2: [
          '10',
        ],
        list2Not1: [
          '40',
        ],
        same: [
          '30',
          '20',
        ],
      });
    });
  });
});
