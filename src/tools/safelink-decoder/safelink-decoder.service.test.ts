import { describe, expect, it } from 'vitest';
import { decodeSafeLinksURL } from './safelink-decoder.service';

describe('safelink-decoder', () => {
  describe('decodeSafeLinksURL', () => {
    describe('decode outlook safelink urls', () => {
      it('should decode basic safelink urls', () => {
        expect(decodeSafeLinksURL('https://aus01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dsafelink%26rlz%3D1&data=05%7C02%7C%7C1ed07253975b46da1d1508dc3443752a%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C638442711583216725%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C0%7C%7C%7C&sdata=%2BQY0HBnnxfI7pzZoxzlhZdDvYu80LwQB0zUUjrffVnk%3D&reserved=0'))
          .toBe('https://www.google.com/search?q=safelink&rlz=1');
      });
      it('should decode encoded safelink urls', () => {
        expect(decodeSafeLinksURL('https://aus01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dsafelink%26rlz%3D1&amp;data=05%7C02%7C%7C1ed07253975b46da1d1508dc3443752a%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C638442711583216725%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C0%7C%7C%7C&amp;sdata=%2BQY0HBnnxfI7pzZoxzlhZdDvYu80LwQB0zUUjrffVnk%3D&amp;reserved=0'))
          .toBe('https://www.google.com/search?q=safelink&rlz=1');
      });
      it('throw on not outlook safelink urls', () => {
        expect(() => decodeSafeLinksURL('https://google.com'))
          .toThrow('Invalid SafeLinks URL provided');
      });
    });
  });
});
