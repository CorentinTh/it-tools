import { describe, expect, it } from 'vitest';
import { matchRegex, matchRegexBounded } from './regex-tester.service';

const regexesData = [
  {
    regex: '',
    text: '',
    flags: '',
    result: [{ captures: [], groups: [], index: 0, value: '' }],
  },
  {
    regex: '.*',
    text: '',
    flags: '',
    result: [{ captures: [], groups: [], index: 0, value: '' }],
  },
  {
    regex: '',
    text: 'aaa',
    flags: '',
    result: [{ captures: [], groups: [], index: 0, value: '' }],
  },
  {
    regex: 'a',
    text: 'baaa',
    flags: '',
    result: [
      {
        captures: [],
        groups: [],
        index: 1,
        value: 'a',
      },
    ],
  },
  {
    regex: '(.)(?<g>r)',
    text: 'azertyr',
    flags: 'g',
    result: [
      {
        captures: [
          {
            end: 3,
            name: '1',
            start: 2,
            value: 'e',
          },
          {
            end: 4,
            name: '2',
            start: 3,
            value: 'r',
          },
        ],
        groups: [
          {
            end: 4,
            name: 'g',
            start: 3,
            value: 'r',
          },
        ],
        index: 2,
        value: 'er',
      },
      {
        captures: [
          {
            end: 6,
            name: '1',
            start: 5,
            value: 'y',
          },
          {
            end: 7,
            name: '2',
            start: 6,
            value: 'r',
          },
        ],
        groups: [
          {
            end: 7,
            name: 'g',
            start: 6,
            value: 'r',
          },
        ],
        index: 5,
        value: 'yr',
      },
    ],
  },
];

describe('regex-tester', () => {
  for (const reg of regexesData) {
    const { regex, text, flags, result: expected_result } = reg;
    it(`Should matchRegex("${regex}","${text}","${flags}") return correct result`, async () => {
      const result = matchRegex(regex, text, `${flags}d`);

      expect(result).to.deep.equal(expected_result);
    });
  }

  it('preserves an unmatched optional positional capture without throwing', () => {
    expect(matchRegex('(a)?b', 'b', 'd')).toEqual([
      {
        captures: [
          {
            end: undefined,
            name: '1',
            start: undefined,
            value: undefined,
          },
        ],
        groups: [],
        index: 0,
        value: 'b',
      },
    ]);
  });

  it('preserves an unmatched optional named capture without throwing', () => {
    expect(matchRegex('(?<x>a)?b', 'b', 'd')).toEqual([
      {
        captures: [
          {
            end: undefined,
            name: '1',
            start: undefined,
            value: undefined,
          },
        ],
        groups: [
          {
            end: undefined,
            name: 'x',
            start: undefined,
            value: undefined,
          },
        ],
        index: 0,
        value: 'b',
      },
    ]);
  });

  it('keeps matched and unmatched capture indices aligned across global matches', () => {
    expect(matchRegex('(a)?(?<x>b)?c', 'abc bc c', 'g')).toEqual([
      {
        captures: [
          { end: 1, name: '1', start: 0, value: 'a' },
          { end: 2, name: '2', start: 1, value: 'b' },
        ],
        groups: [{ end: 2, name: 'x', start: 1, value: 'b' }],
        index: 0,
        value: 'abc',
      },
      {
        captures: [
          { end: undefined, name: '1', start: undefined, value: undefined },
          { end: 5, name: '2', start: 4, value: 'b' },
        ],
        groups: [{ end: 5, name: 'x', start: 4, value: 'b' }],
        index: 4,
        value: 'bc',
      },
      {
        captures: [
          { end: undefined, name: '1', start: undefined, value: undefined },
          { end: undefined, name: '2', start: undefined, value: undefined },
        ],
        groups: [{ end: undefined, name: 'x', start: undefined, value: undefined }],
        index: 7,
        value: 'c',
      },
    ]);
  });

  it('keeps native malformed pattern and flag errors visible to callers', () => {
    expect(() => matchRegex('(', 'text', '')).toThrow(SyntaxError);
    expect(() => matchRegex('a', 'text', 'gg')).toThrow(SyntaxError);
  });

  it('reports bounded global zero-width matches without looping forever', () => {
    expect(matchRegexBounded('(?=a)', 'aaa', 'g', {
      maxMatches: 2,
      maxCapturesPerMatch: 1,
      maxCaptureEntries: 10,
      maxResultCharacters: 100,
    })).toEqual({
      matches: [
        { captures: [], groups: [], index: 0, value: '' },
        { captures: [], groups: [], index: 1, value: '' },
      ],
      truncated: true,
    });
  });

  it('advances global zero-width matches by Unicode code point in Unicode mode', () => {
    expect(matchRegex('(?=)', '😀', 'gu').map(match => match.index)).toEqual([0, 2]);
    expect(matchRegex('(?=)', '😀', 'g').map(match => match.index)).toEqual([0, 1, 2]);
  });

  it('bounds match rows and capture metadata without losing completed rows', () => {
    expect(matchRegexBounded('(a)', 'aaaa', 'g', {
      maxMatches: 2,
      maxCapturesPerMatch: 1,
      maxCaptureEntries: 10,
      maxResultCharacters: 100,
    })).toEqual({
      matches: [
        {
          captures: [{ end: 1, name: '1', start: 0, value: 'a' }],
          groups: [],
          index: 0,
          value: 'a',
        },
        {
          captures: [{ end: 2, name: '1', start: 1, value: 'a' }],
          groups: [],
          index: 1,
          value: 'a',
        },
      ],
      truncated: true,
    });
  });

  it('bounds captures per row and reports that metadata was truncated', () => {
    expect(matchRegexBounded('(a)(b)(c)', 'abc', '', {
      maxMatches: 10,
      maxCapturesPerMatch: 2,
      maxCaptureEntries: 10,
      maxResultCharacters: 100,
    })).toEqual({
      matches: [
        {
          captures: [
            { end: 1, name: '1', start: 0, value: 'a' },
            { end: 2, name: '2', start: 1, value: 'b' },
          ],
          groups: [],
          index: 0,
          value: 'abc',
        },
      ],
      truncated: true,
    });
  });
});
