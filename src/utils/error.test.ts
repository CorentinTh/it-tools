import { describe, expect, it } from 'vitest';
import { getErrorMessageIfThrows } from './error';

describe('error util', () => {
  describe('getErrorMessageIfThrows', () => {
    it('get an error message if the callback throws, undefined instead', () => {
      expect(
        getErrorMessageIfThrows(() => {
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
          throw { message: 'message' };
        }),
      ).to.equal('message');

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(getErrorMessageIfThrows(() => {})).to.equal(undefined);
    });
  });
});
