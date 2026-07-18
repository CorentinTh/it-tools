import { describe, expect, it } from 'vitest';
import { getUrlProperties, getUrlQueryParameters, parseUrl } from './url-parser.model';

describe('url-parser model', () => {
  it('preserves repeated, empty, and encoded query parameters in source order', () => {
    const parsedUrl = parseUrl(
      'https://example.com/path?tag=first&empty&tag=second%20value&tag=',
    );

    expect(getUrlQueryParameters(parsedUrl)).toEqual([
      { id: '0:tag', name: 'tag', value: 'first' },
      { id: '1:empty', name: 'empty', value: '' },
      { id: '2:tag', name: 'tag', value: 'second value' },
      { id: '3:tag', name: 'tag', value: '' },
    ]);
  });

  it('includes the URL fragment in the displayed properties', () => {
    const properties = getUrlProperties(parseUrl('https://example.com/path#section%20one'));

    expect(properties.find(({ key }) => key === 'hash')).toEqual({
      title: 'Fragment',
      key: 'hash',
      value: '#section%20one',
    });
  });

  it('returns empty display values for an invalid URL', () => {
    expect(parseUrl('not a URL')).toBeUndefined();
    expect(getUrlQueryParameters(undefined)).toEqual([]);
    expect(getUrlProperties(undefined).every(({ value }) => value === '')).toBe(true);
  });
});
