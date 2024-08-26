import { describe, expect, it } from 'vitest';
import { generateWpaPskRawKey } from './wpa-psk-generator.service';

describe('wpa-psk-generator', () => {
  it('generateWpaPskRawKey should generate raw key', () => {
    expect(generateWpaPskRawKey('test', 'test')).to.deep.eq({
      passphrase: 'test',
      psk: 'd630c5513becfd3952432bd7fcf098b7a40907f3214cf43551f1b8cfda873ecc',
      ssid: 'test',
    });
    expect(generateWpaPskRawKey('test', 'test')?.psk).toHaveLength(256 / 8 * 2);
  });
});
