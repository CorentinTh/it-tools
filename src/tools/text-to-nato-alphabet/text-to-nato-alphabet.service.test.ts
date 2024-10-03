import { describe, expect, it } from 'vitest';
import { textToNatoAlphabet } from './text-to-nato-alphabet.service';
import natoTests from './nato.test.data.json';

describe('text-to-nato', () => {
  it('Convert text to NATO', async () => {
    for (const nato of natoTests) {
      const { lang, input, output } = nato;
      expect(textToNatoAlphabet({ text: input, langOrCountry: lang })).to.equal(output);
    }
  });
});
