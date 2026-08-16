import { describe, expect, it } from 'vitest';
import { generatePassphrase, validatePassphraseOptions } from './passphrase-generator.service';

const defaults = { wordCount: 6, separator: '-', capitalize: false, appendNumber: false, appendSymbol: false };

describe('passphrase generator', () => {
  it('selects words through unbiased random indexes and reports entropy', () => {
    let counter = 0;
    const result = generatePassphrase(defaults, (values) => {
      values[0] = counter++;
      return values;
    });
    expect(result.value).toBe('abandon-ability-able-about-above-absent');
    expect(result.wordListSize).toBe(2048);
    expect(result.entropyBits).toBe(66);
  });

  it('adds optional transformations without overstating deterministic capitalization entropy', () => {
    const result = generatePassphrase({ ...defaults, wordCount: 4, capitalize: true, appendNumber: true, appendSymbol: true }, (values) => {
      values[0] = 0;
      return values;
    });
    expect(result.value).toBe('Abandon-Abandon-Abandon-Abandon0!');
    expect(result.entropyBits).toBeCloseTo(4 * 11 + Math.log2(10) + Math.log2(12));
  });

  it('rejects unsafe or unbounded configuration', () => {
    expect(() => validatePassphraseOptions({ ...defaults, wordCount: 3 })).toThrow(/between 4 and 12/u);
    expect(() => validatePassphraseOptions({ ...defaults, separator: '\n' })).toThrow(/Separator/u);
  });
});
