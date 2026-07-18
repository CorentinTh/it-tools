import { afterEach, describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, ref } from 'vue';
import { computedRefreshable, computedRefreshableAsync } from './computedRefreshable';

function createDeferred<T>() {
  let resolveDeferred!: (value: T) => void;
  let rejectDeferred!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    resolveDeferred = resolve;
    rejectDeferred = reject;
  });

  return { promise, reject: rejectDeferred, resolve: resolveDeferred };
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await nextTick();
}

describe('computedRefreshable', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('invokes the getter once initially and once per dependency or manual refresh', async () => {
    const dependency = ref('initial');
    const getter = vi.fn(() => dependency.value.toUpperCase());
    const [value, refresh] = computedRefreshable(getter, { dependencies: [dependency] });

    expect(getter).toHaveBeenCalledTimes(1);
    expect(value.value).toBe('INITIAL');
    expect(value.value).toBe('INITIAL');
    expect(getter).toHaveBeenCalledTimes(1);

    dependency.value = 'dependency';
    await nextTick();

    expect(value.value).toBe('DEPENDENCY');
    expect(getter).toHaveBeenCalledTimes(2);

    refresh();

    expect(value.value).toBe('DEPENDENCY');
    expect(getter).toHaveBeenCalledTimes(3);
  });

  it('does not track reactive values that were not declared as dependencies', async () => {
    const unlisted = ref(1);
    const getter = vi.fn(() => unlisted.value);
    const [value, refresh] = computedRefreshable(getter, { dependencies: [] });

    unlisted.value = 2;
    await nextTick();

    expect(getter).toHaveBeenCalledTimes(1);
    expect(value.value).toBe(1);

    refresh();

    expect(getter).toHaveBeenCalledTimes(2);
    expect(value.value).toBe(2);
  });

  it('coalesces a burst of dependency changes according to the throttle', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);

    const dependency = ref(0);
    const getter = vi.fn(() => dependency.value);
    const [value] = computedRefreshable(getter, {
      dependencies: [dependency],
      throttle: 500,
    });

    dependency.value = 1;
    await nextTick();

    expect(getter).toHaveBeenCalledTimes(2);
    expect(value.value).toBe(1);

    dependency.value = 2;
    await nextTick();
    dependency.value = 3;
    await nextTick();

    expect(getter).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(500);

    expect(getter).toHaveBeenCalledTimes(3);
    expect(value.value).toBe(3);
  });
});

describe('computedRefreshableAsync', () => {
  it('invokes the getter once initially and once per dependency or manual refresh', async () => {
    const dependency = ref(1);
    const jobs: Array<ReturnType<typeof createDeferred<number>>> = [];
    const getter = vi.fn(() => {
      const deferred = createDeferred<number>();
      jobs.push(deferred);
      return deferred.promise;
    });
    const [value, refresh] = computedRefreshableAsync(getter, {
      defaultValue: 0,
      dependencies: [dependency],
    });

    expect(getter).toHaveBeenCalledTimes(1);
    expect(value.value).toBe(0);

    jobs[0].resolve(10);
    await flushPromises();
    expect(value.value).toBe(10);

    dependency.value = 2;
    await nextTick();
    expect(getter).toHaveBeenCalledTimes(2);

    jobs[1].resolve(20);
    await flushPromises();
    expect(value.value).toBe(20);

    refresh();
    expect(getter).toHaveBeenCalledTimes(3);

    jobs[2].resolve(30);
    await flushPromises();
    expect(value.value).toBe(30);
  });

  it('aborts superseded work and never commits an out-of-order result', async () => {
    const dependency = ref('old');
    const jobs: Array<{
      deferred: ReturnType<typeof createDeferred<string>>
      signal: AbortSignal
    }> = [];
    const getter = vi.fn(({ signal }: { signal: AbortSignal }) => {
      const deferred = createDeferred<string>();
      jobs.push({ deferred, signal });
      return deferred.promise;
    });
    const [value] = computedRefreshableAsync(getter, {
      defaultValue: 'default',
      dependencies: [dependency],
    });

    dependency.value = 'new';
    await nextTick();

    expect(getter).toHaveBeenCalledTimes(2);
    expect(jobs[0].signal.aborted).toBe(true);
    expect(jobs[1].signal.aborted).toBe(false);

    jobs[1].deferred.resolve('new result');
    await flushPromises();
    expect(value.value).toBe('new result');

    jobs[0].deferred.resolve('stale result');
    await flushPromises();
    expect(value.value).toBe('new result');
  });

  it('exposes pending and error state for the current job', async () => {
    const first = createDeferred<string>();
    const failure = new Error('generation failed');
    const getter = vi.fn(() => first.promise);
    const [value, refresh, state] = computedRefreshableAsync(getter, {
      defaultValue: 'fallback',
      dependencies: [],
    });

    expect(value.value).toBe('fallback');
    expect(state.isPending.value).toBe(true);
    expect(state.error.value).toBeUndefined();

    first.reject(failure);
    await flushPromises();

    expect(value.value).toBe('fallback');
    expect(state.isPending.value).toBe(false);
    expect(state.error.value).toBe(failure);

    const second = createDeferred<string>();
    getter.mockReturnValueOnce(second.promise);
    refresh();

    expect(state.error.value).toBeUndefined();
    expect(state.isPending.value).toBe(true);

    second.resolve('recovered');
    await flushPromises();

    expect(value.value).toBe('recovered');
    expect(state.isPending.value).toBe(false);
  });

  it('aborts the current job when its effect scope is disposed', async () => {
    const deferred = createDeferred<string>();
    let signal: AbortSignal | undefined;
    const scope = effectScope();

    scope.run(() => {
      computedRefreshableAsync(
        (context) => {
          signal = context.signal;
          return deferred.promise;
        },
        { defaultValue: '', dependencies: [] },
      );
    });

    expect(signal?.aborted).toBe(false);

    scope.stop();

    expect(signal?.aborted).toBe(true);

    deferred.resolve('ignored');
    await flushPromises();
  });
});
