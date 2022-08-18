import _ from 'lodash';
import { describe, expect, it } from 'vitest';
import { isNotThrowing } from './boolean';

describe('boolean utils', () => {
  describe('isNotThrowing', () => {
    it('should return if the call throws or false otherwise', () => {
      expect(isNotThrowing(_.noop)).to.eql(true);
      expect(
        isNotThrowing(() => {
          throw new Error();
        }),
      ).to.eql(false);
    });
  });
});
