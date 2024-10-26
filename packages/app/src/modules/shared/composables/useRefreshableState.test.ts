// @vitest-environment nuxt
import { describe, expect, test } from 'vitest';
import { useRefreshableState } from './useRefreshableState';

describe('useRefreshableState composables', () => {
  describe('useRefreshableState', () => {
    test('the tuple provided by useRefreshableState contain the state that is the result of the provided function and a refresh function', () => {
      let index = 0;

      const [state, refresh] = useRefreshableState('key', () => ++index);

      expect(state.value).to.equal(1);
      expect(index).to.equal(1);

      refresh();

      expect(state.value).to.equal(2);
      expect(index).to.equal(2);
    });
  });
});
