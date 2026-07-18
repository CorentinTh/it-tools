import RandExp from 'randexp';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateRegexSample } from './regex-tester.sample.service';
import type { RegexTaskError } from './regex-tester.worker.protocol';

describe('generateRegexSample', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generates a verified sample for named captures', () => {
    const sample = generateRegexSample({ operation: 'sample', pattern: '(?<word>ab){2}', flags: 'd' });

    expect(sample).toBe('abab');
    expect(/(?<word>ab){2}/d.test(sample)).toBe(true);
  });

  it('rejects an explicit repetition above the practical limit before looping', () => {
    expect(() => generateRegexSample({ operation: 'sample', pattern: 'a{33}', flags: '' }))
      .toThrowError(expect.objectContaining<Partial<RegexTaskError>>({ code: 'limit' }));
  });

  it('rejects multiplicative nested generation before allocating the sample', () => {
    const generate = vi.spyOn(RandExp.prototype, 'gen');

    expect(() => generateRegexSample({
      operation: 'sample',
      pattern: '((((a{32}){32}){32}){32}){32}',
      flags: '',
    }))
      .toThrowError(expect.objectContaining<Partial<RegexTaskError>>({ code: 'limit' }));
    expect(generate).not.toHaveBeenCalled();
  });

  it('keeps skipped-group backreferences aligned with lexical capture numbering', () => {
    const generate = vi.spyOn(RandExp.prototype, 'gen');
    const pattern = '(){0}((?:(?:x{32}){32}){4})(?:(?:\\1){32}){32}';

    const sample = generateRegexSample({ operation: 'sample', pattern, flags: '' });

    expect(sample).toHaveLength(4_096);
    expect(new RegExp(pattern).test(sample)).toBe(true);
    expect(generate).toHaveBeenCalledOnce();
  });

  it('keeps lookahead captures in lexical numbering without amplifying another group', () => {
    const generate = vi.spyOn(RandExp.prototype, 'gen');
    const pattern = '(?=())((?:(?:x{32}){32}){4})(?:(?:\\1){32}){32}';

    const sample = generateRegexSample({ operation: 'sample', pattern, flags: '' });

    expect(sample).toHaveLength(4_096);
    expect(new RegExp(pattern).test(sample)).toBe(true);
    expect(generate).toHaveBeenCalledOnce();
  });

  it('rejects backreference amplification before allocating the sample', () => {
    const generate = vi.spyOn(RandExp.prototype, 'gen');
    const pattern = '((?:(?:x{32}){32}){4})(?:(?:\\1){32}){32}';

    expect(() => generateRegexSample({ operation: 'sample', pattern, flags: '' }))
      .toThrowError(expect.objectContaining<Partial<RegexTaskError>>({ code: 'limit' }));
    expect(generate).not.toHaveBeenCalled();
  });

  it('refuses to label an unsupported generation as matching', () => {
    expect(() => generateRegexSample({ operation: 'sample', pattern: '(?!a)a', flags: '' }))
      .toThrowError(expect.objectContaining<Partial<RegexTaskError>>({ code: 'operation' }));
  });
});
