import _ from 'lodash';
import { describe, expect, it } from 'vitest';
import { booleanToHumanReadable, isNotThrowing } from './boolean';

describe('boolean utils', () => {
  describe('isNotThrowing', () => {
    it('should return if the call throws or false otherwise', () => {
      expect(isNotThrowing(_.noop)).to.eql(true);
      expect(
        isNotThrowing(() => {
          throw new Error('message');
        }),
      ).to.eql(false);
    });
  });

  describe('booleanToHumanReadable', () => {
    it('should return "Yes" if the value is true and "No" otherwise', () => {
      expect(booleanToHumanReadable(true)).to.eql('Yes');
      expect(booleanToHumanReadable(false)).to.eql('No');
    });
  });
});
