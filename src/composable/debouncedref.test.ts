import { effectScope, nextTick, watch } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useDebouncedRef from './debouncedref';

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebouncedRef', () => {
  it('publishes only the trailing value after the delay by default', async () => {
    vi.useFakeTimers();
    const value = useDebouncedRef('initial', 50);
    const seen: string[] = [];
    watch(value, next => seen.push(next));

    value.value = 'first';
    value.value = 'last';
    expect(value.value).toBe('initial');
    await vi.advanceTimersByTimeAsync(50);
    await nextTick();

    expect(value.value).toBe('last');
    expect(seen).toEqual(['last']);
  });

  it('matches leading debounce semantics and cancels a scoped timer on disposal', async () => {
    vi.useFakeTimers();
    const scope = effectScope();
    const seen: string[] = [];
    const value = scope.run(() => {
      const scoped = useDebouncedRef('initial', 50, true);
      watch(scoped, next => seen.push(next));
      return scoped;
    });
    if (!value) {
      throw new Error('Expected a scoped ref.');
    }

    value.value = 'leading';
    await nextTick();
    expect(seen).toEqual(['leading']);

    value.value = 'trailing';
    scope.stop();
    await vi.advanceTimersByTimeAsync(50);
    expect(seen).toEqual(['leading']);
  });
});
