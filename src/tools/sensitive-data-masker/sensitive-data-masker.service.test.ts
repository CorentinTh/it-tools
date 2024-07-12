import { describe, expect, it } from 'vitest';
import { maskSensitiveData } from './sensitive-data-masker.service';

describe('sensitive-data-masker', () => {
  describe('maskSensitiveData', () => {
    const data = `{
  email: 'john.doe@example.com',
  creditCard: '1234 5678 9000 9876',
  id: '3f8a43fd-6489-4ec7-bd55-7a1ba172d77b',
  name: 'John',
  surname: 'Doe',
  phone: '+358 40 1234567',
  url: 'truc.google.com',
  ip4: '83.24.45.56',
  ip6: '2001:db8:0:85a3:0:0:ac1f:8001',
  mac: '3D:F2:C9:A6:B3:4F',
  token: 'eyJhbGciOiJIUzI1NiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbGV4IEtvemxvdiIsDQogICJpYXQiOiAxNTE2MjM5MDIyDQp9.PNKysYFTCenU5bekHCmwIxCUXoYG41H_xc3uN3ZF_b8',
}`;

    it('should maks sensitive data', () => {
      expect(maskSensitiveData({
        value: data,
      })).toBe(`{
  email: 'jo****************om',
  creditCard: '12***************76',
  id: '3f********************************7b',
  name: 'John',
  surname: 'Doe',
  phone: '+3***********67',
  url: 'tr***********om',
  ip4: '83*******56',
  ip6: '20*************************01',
  mac: '3D*************4F',
  token: 'ey*****************************************************************************************************************************************************************b8',
}`);
    });
    it('should maks sensitive data (with custom regex)', () => {
      expect(maskSensitiveData({
        value: data,
        customRegex: 'John\nDoe',
      })).toBe(`{
  email: 'jo****************om',
  creditCard: '12***************76',
  id: '3f********************************7b',
  name: '****',
  surname: '***',
  phone: '+3***********67',
  url: 'tr***********om',
  ip4: '83*******56',
  ip6: '20*************************01',
  mac: '3D*************4F',
  token: 'ey*****************************************************************************************************************************************************************b8',
}`);
    });

    it('should maks sensitive data (with excluded matchers)', () => {
      expect(maskSensitiveData({
        value: data,
        excludedMatchers: ['mac', 'ipv4'],
      })).toBe(`{
  email: 'jo****************om',
  creditCard: '12***************76',
  id: '3f********************************7b',
  name: 'John',
  surname: 'Doe',
  phone: '+3***********67',
  url: 'tr***********om',
  ip4: '83.24.45.56',
  ip6: '20*************************01',
  mac: '3D:F2:C9:A6:B3:4F',
  token: 'ey*****************************************************************************************************************************************************************b8',
}`);
    });
  });
});
