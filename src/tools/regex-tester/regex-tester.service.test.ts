import { describe, expect, it } from 'vitest';
import { matchRegex } from './regex-tester.service';

const regexesData = [
  {
    regex: '',
    text: '',
    flags: '',
    result: [],
  },
  {
    regex: '.*',
    text: '',
    flags: '',
    result: [],
  },
  {
    regex: '',
    text: 'aaa',
    flags: '',
    result: [],
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
  {
    regex: String.raw`\s([^\s\[]+)(?:\[(\d+)\])?:\s`,
    text: 'Nov 11 21:03:26 abc2 def.sh[1]: \nNov 11 21:03:26 abc2 def.sh: ',
    flags: 'gm',
    result: [
      {
        captures: [
          {
            end: 27,
            name: '1',
            start: 21,
            value: 'def.sh',
          },
          {
            end: 29,
            name: '2',
            start: 28,
            value: '1',
          },
        ],
        groups: [],
        index: 20,
        value: ' def.sh[1]: ',
      },
      {
        captures: [
          {
            end: 60,
            name: '1',
            start: 54,
            value: 'def.sh',
          },
          {
            end: -1,
            name: '2',
            start: -1,
            value: undefined,
          },
        ],
        groups: [],
        index: 53,
        value: ' def.sh: ',
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
});
