import { describe, expect, it } from 'vitest';
import { getErrorMessageIfThrows } from './error';

describe('error util', () => {
  describe('getErrorMessageIfThrows', () => {
    it('get an error message if the callback throws, undefined instead', () => {
      expect(
        getErrorMessageIfThrows(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'message';
        }),
      ).to.equal('message');

      expect(
        getErrorMessageIfThrows(() => {
          throw new Error('message');
        }),
      ).to.equal('message');

      expect(
        getErrorMessageIfThrows(() => {
          // eslint-disable-next-line no-throw-literal
          throw { message: 'message' };
        }),
      ).to.equal('message');

      expect(getErrorMessageIfThrows(() => {})).to.equal(undefined);
    });
  });
});
