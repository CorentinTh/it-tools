import { describe, expect, test } from 'vitest';
import { createRefreshableSignal } from './signals';

describe('signals', () => {
  describe('createRefreshableSignal', () => {
    test('the state initially has the value returned by the getter', () => {
      const [getState] = createRefreshableSignal(() => 42);
      expect(getState()).to.eql(42);
    });

    test('calling the refresh function updates the state', () => {
      let value = 0;
      const [getState, refresh] = createRefreshableSignal(() => value++);

      expect(getState()).to.eql(0);

      refresh();

      expect(getState()).to.eql(1);
      expect(getState()).to.eql(1);
    });

    test('the state can be muted using the setState function', () => {
      const [getState, , { setState }] = createRefreshableSignal(() => 0);

      expect(getState()).to.eql(0);

      setState(42);

      expect(getState()).to.eql(42);
    });
  });
});
