import { describe, expect, it } from 'vitest';
import { generateWpaPskRawKey } from './wpa-psk-generator.service';

describe('wpa-psk-generator', () => {
  it('generateWpaPskRawKey should generate raw key', () => {
    expect(generateWpaPskRawKey('test', 'test')).to.deep.eq({
      passphrase: 'test',
      psk: 'd630c5513becfd3952432bd7fcf098b7a40907f3214cf43551f1b8cfda873eccd55e2e0c6b8fed55feecdd7f21db4fb6b31c602fe3f5e58e7edd462b12e4acc4632aa41c4755646b8a52826cb76f3a984571c4cfc73a1a2684f55790fac9e1f6c6002faedcb6c2d47a3678139027b95641efbcecd934b712bf48db71a76d8915',
      ssid: 'test',
    });
  });
});
