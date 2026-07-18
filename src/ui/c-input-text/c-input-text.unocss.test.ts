import { createGenerator } from 'unocss';
import { describe, expect, it } from 'vitest';
import unocssConfig from '../../../unocss.config';

describe('CInputText UnoCSS integration', () => {
  it('ignores the native size attribute while retaining other Attributify utilities', async () => {
    const generator = await createGenerator(unocssConfig);
    const { css } = await generator.generate('<input size="1" w-full>');

    expect(css).not.toMatch(/\[size~/);
    expect(css).toMatch(/\[w-full=/);
  });
});
