import { describe, expect, it } from 'vitest';
import {
  type UrlEncodingMode,
  decodeUrlText,
  encodeUrlText,
  urlEncodingModes,
} from './url-encoder.model';

const modes = urlEncodingModes.map(({ value }) => value);

describe('url-encoder model', () => {
  it.each<[UrlEncodingMode, string]>([
    ['component', '!\'()*~'],
    ['rfc3986', '%21%27%28%29%2A~'],
    ['rfc5987', '!%27%28%29%2A~'],
    ['form', '%21%27%28%29*%7E'],
  ])('encodes the reserved-character boundary in %s mode', (mode, expected) => {
    expect(encodeUrlText('!\'()*~', mode)).toBe(expected);
  });

  it('uses the RFC 5987 attr-char set for an extended parameter value', () => {
    expect(encodeUrlText('azAZ09!#$&+-.^_`|~*\'%', 'rfc5987'))
      .toBe('azAZ09!#$&+-.^_`|~%2A%27%25');
  });

  it('matches the UTF-8 value portion of the RFC 5987 currency example', () => {
    const encoded = encodeUrlText('£ and € rates', 'rfc5987');

    expect(encoded).toBe('%C2%A3%20and%20%E2%82%AC%20rates');
    expect(decodeUrlText(encoded, 'rfc5987')).toBe('£ and € rates');
  });

  it.each(modes)('encodes Unicode as uppercase UTF-8 percent triplets in %s mode', (mode) => {
    const encoded = encodeUrlText('£ € 😀', mode);
    const encodedSpace = mode === 'form' ? '+' : '%20';

    expect(encoded).toBe(`%C2%A3${encodedSpace}%E2%82%AC${encodedSpace}%F0%9F%98%80`);
    expect(decodeUrlText('%c2%a3', mode)).toBe('£');
  });

  it('applies form space/plus semantics without losing literal plus signs', () => {
    expect(encodeUrlText('first value+second value', 'form')).toBe('first+value%2Bsecond+value');
    expect(decodeUrlText('first+value%2Bsecond+value', 'form')).toBe('first value+second value');
    expect(decodeUrlText('+', 'component')).toBe('+');
    expect(decodeUrlText('+', 'form')).toBe(' ');
  });

  it.each(modes)('round-trips arbitrary text in %s mode', (mode) => {
    const input = 'A+B 100% — café 😀 !\'()*~|^`';

    expect(decodeUrlText(encodeUrlText(input, mode), mode)).toBe(input);
  });

  it.each(modes)('rejects malformed percent escapes in %s mode', (mode) => {
    expect(() => decodeUrlText('valid%20then%2', mode)).toThrow(URIError);
    expect(() => decodeUrlText('%C3%28', mode)).toThrow(URIError);
  });
});
