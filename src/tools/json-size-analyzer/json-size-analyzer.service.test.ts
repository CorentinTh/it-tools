import { describe, expect, it } from 'vitest';
import { getJsonUsageTreeNodes } from './json-size-analyzer.service';

describe('json-size-analyzer', () => {
  describe('getJsonUsageTreeNodes', () => {
    it('return correct tree nodes structures', () => {
      expect(getJsonUsageTreeNodes([{ a: [1, 2, 3] }, { b: 'a' }])).to.deep.eq({
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [],
                    key: '$.[0].a.[0]',
                    label: '$.[0].a.[0]: 1 B(26 B gzip)',
                  },
                  {
                    children: [],
                    key: '$.[0].a.[1]',
                    label: '$.[0].a.[1]: 1 B(24 B gzip)',
                  },
                  {
                    children: [],
                    key: '$.[0].a.[2]',
                    label: '$.[0].a.[2]: 1 B(25 B gzip)',
                  },
                ],
                key: '$.[0].a',
                label: '$.[0].a: 7 B(35 B gzip) ; 28.000% of parent ; biggest child node: \'0\'',
              },
            ],
            key: '$.[0]',
            label: '$.[0]: 13 B(43 B gzip) ; 52.000% of parent ; biggest child node: \'a\'',
          },
          {
            children: [
              {
                children: [],
                key: '$.[1].b',
                label: '$.[1].b: 1 B(25 B gzip)',
              },
            ],
            key: '$.[1]',
            label: '$.[1]: 9 B(34 B gzip) ; 36.000% of parent ; biggest child node: \'b\'',
          },
        ],
        key: '$',
        label: '$: 25 B(61 B gzip) ; 100.00% of parent ; biggest child node: \'0\'',
      });
      expect(getJsonUsageTreeNodes({ a: { b: [1, 2, 3], c: 12 } })).to.deep.eq({
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [],
                    key: '$.a.b.[0]',
                    label: '$.a.b.[0]: 1 B(26 B gzip)',
                  },
                  {
                    children: [],
                    key: '$.a.b.[1]',
                    label: '$.a.b.[1]: 1 B(24 B gzip)',
                  },
                  {
                    children: [],
                    key: '$.a.b.[2]',
                    label: '$.a.b.[2]: 1 B(25 B gzip)',
                  },
                ],
                key: '$.a.b',
                label: '$.a.b: 7 B(35 B gzip) ; 26.923% of parent ; biggest child node: \'0\'',
              },
              {
                children: [],
                key: '$.a.c',
                label: '$.a.c: 2 B(24 B gzip)',
              },
            ],
            key: '$.a',
            label: '$.a: 20 B(50 B gzip) ; 76.923% of parent ; biggest child node: \'b\'',
          },
        ],
        key: '$',
        label: '$: 26 B(63 B gzip) ; 100.00% of parent ; biggest child node: \'a\'',
      });
      expect(getJsonUsageTreeNodes({ a: { b: 'azerty', c: 'ueop' } })).to.deep.eq({
        children: [
          {
            children: [
              {
                children: [],
                key: '$.a.b',
                label: '$.a.b: 6 B(30 B gzip)',
              },
              {
                children: [],
                key: '$.a.c',
                label: '$.a.c: 4 B(29 B gzip)',
              },
            ],
            key: '$.a',
            label: '$.a: 25 B(51 B gzip) ; 80.645% of parent ; biggest child node: \'b\'',
          },
        ],
        key: '$',
        label: '$: 31 B(61 B gzip) ; 100.00% of parent ; biggest child node: \'a\'',
      });
    });
  });
});
