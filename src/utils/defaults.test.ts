import { describe, expect, it } from 'vitest';
import { withDefaultOnError } from './defaults';

describe('defaults util', () => {
  describe('withDefaultOnError', () => {
    it('should return the callback or the default one if the callback throws', () => {
      expect(withDefaultOnError(() => 'original', 'default')).to.eql('original');
    });

    expect(
      withDefaultOnError(() => {
        throw new Error('message');
      }, 'default'),
    ).to.eql('default');
  });
});
