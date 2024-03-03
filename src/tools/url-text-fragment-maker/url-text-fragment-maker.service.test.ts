import { describe, expect, it } from 'vitest';
import { getUrlWithTextFragment } from './url-text-fragment-maker.service';

describe('url-text-fragment-maker.service', () => {
  describe('getUrlWithTextFragment', () => {
    describe('compute url with text fragment', () => {
      it('throws on invalid url', () => {
        expect(() => getUrlWithTextFragment({
          url: 'example',
          textStartSearch: 'for',
        })).toThrow('Invalid url');
        expect(() => getUrlWithTextFragment({
          url: 'htt://example',
          textStartSearch: 'for',
        })).toThrow('Url must have http:// or https:// prefix');
        expect(() => getUrlWithTextFragment({
          url: 'http:/example',
          textStartSearch: 'for',
        })).toThrow('Url must have http:// or https:// prefix');
      });

      it('should handle basic cases', () => {
        expect(getUrlWithTextFragment({
          url: 'https://example.com',
          textStartSearch: 'for',
        }))
          .toBe('https://example.com#:~:text=for');
        expect(getUrlWithTextFragment({
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
          textStartSearch: 'human',
        }))
          .toBe('https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#:~:text=human');
      });

      it('should be url encoded', () => {
        expect(getUrlWithTextFragment({
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
          textStartSearch: 'linked URL',
          suffixSearch: '\'s format',
        }))
          .toBe('https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#:~:text=linked%20URL,-\'s%20format');
        expect(getUrlWithTextFragment({
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
          textStartSearch: 'The Referer',
          textStopSearch: 'be sent',
          prefixSearch: 'downgrade:',
          suffixSearch: 'to origins',
        }))
          .toBe('https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#:~:text=downgrade%3A-,The%20Referer,be%20sent,-to%20origins');
      });

      it('should handle multiple comma separated and encoded', () => {
        expect(
          getUrlWithTextFragment({
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
            textStartSearch: 'Causes,linked',
          }))
          .toBe('https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#:~:text=Causes&text=linked');

        expect(
          getUrlWithTextFragment({
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
            textStartSearch: 'Causes 1,linked 1',
          }))
          .toBe('https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#:~:text=Causes%201&text=linked%201');

        expect(
          getUrlWithTextFragment({
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
            textStartSearch: 'Causes , linked',
          }))
          .toBe('https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#:~:text=Causes&text=linked');
      });
    });
  });
});
