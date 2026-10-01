import { describe, expect, it } from 'vitest';
import { matchRegex } from './regex-tester.service';

describe('regex-tester: matchRegex', () => {
  it('finds matches with capture groups and indices', () => {
    const results = matchRegex('\\s(\\w+):', 'a b: c d:', 'dg');
    expect(results).toHaveLength(2);
    expect(results[0]?.value).toBe(' b:');
    expect(results[0]?.captures[0]?.value).toBe('b');
  });

  it('keeps matching when an optional group does not participate (#1388)', () => {
    const regex = '\\s([^\\s\\[]+)(?:\\[(\\d+)\\])?:\\s';
    const text = 'Nov 11 21:03:26 abc2 def.sh[1]: \nNov 11 21:03:26 abc2 def.sh: ';
    const results = matchRegex(regex, text, 'dg');
    expect(results).toHaveLength(2);
    // first line: both groups participate
    expect(results[0]?.captures.map(capture => capture.value)).toEqual(['def.sh', '1']);
    // second line: the optional digits group did not participate
    expect(results[1]?.captures.map(capture => capture.value)).toEqual(['def.sh']);
  });

  it('keeps matching named groups that do not participate', () => {
    const results = matchRegex('(?<word>\\w+)?x(?<tail>\\d+)', 'x123', 'dg');
    expect(results).toHaveLength(1);
    expect(results[0]?.groups.map(group => group.name)).toEqual(['tail']);
  });

  it('stops at the first zero-length match to avoid infinite loops', () => {
    const results = matchRegex('a*', 'bbb', 'dg');
    expect(results).toHaveLength(0);
  });
});
