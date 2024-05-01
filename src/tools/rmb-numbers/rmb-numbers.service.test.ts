import { describe, expect, it } from 'vitest';
import { rmb } from './rmb-numbers.service';

describe('rmb-case-converter', () => {
  it('rmb to convert rmb numbers to uppercase', async () => {
    expect(rmb(123)).to.deep.equal([
      {
        type: 'number',
        value: '壹',
      },
      {
        type: 'unit',
        value: '佰',
      },
      {
        type: 'number',
        value: '贰',
      },
      {
        type: 'unit',
        value: '拾',
      },
      {
        type: 'number',
        value: '叁',
      },
      {
        type: 'unit',
        value: '元',
      },
      {
        type: 'cut',
        value: '整',
      },
    ]);
  });
});
