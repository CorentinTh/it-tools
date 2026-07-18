import { watchThrottled } from '@vueuse/core';
import {
  type ComputedRef,
  type WatchSource,
  computed,
  getCurrentScope,
  onScopeDispose,
  shallowRef,
  watch,
} from 'vue';

export { computedRefreshable, computedRefreshableAsync };
export type {
  ComputedRefreshableAsyncOptions,
  ComputedRefreshableOptions,
  RefreshableAsyncContext,
  RefreshableAsyncState,
  RefreshableDependency,
};

type RefreshableDependency = WatchSource<unknown>;

interface ComputedRefreshableOptions {
  dependencies: readonly RefreshableDependency[]
  throttle?: number
}

interface RefreshableAsyncContext {
  signal: AbortSignal
}

interface ComputedRefreshableAsyncOptions<T> extends ComputedRefreshableOptions {
  defaultValue: T
}

interface RefreshableAsyncState {
  cancel: () => void
  error: ComputedRef<unknown | undefined>
  isPending: ComputedRef<boolean>
}

function watchDependencies(
  dependencies: readonly RefreshableDependency[],
  refresh: () => void,
  throttle?: number,
) {
  if (dependencies.length === 0) {
    return;
  }

  const sources = [...dependencies];

  if (throttle !== undefined && throttle > 0) {
    watchThrottled(sources, refresh, { throttle });
    return;
  }

  watch(sources, refresh);
}

function computedRefreshable<T>(
  getter: () => T,
  { dependencies, throttle }: ComputedRefreshableOptions,
) {
  const state = shallowRef<T>(getter());

  const refresh = () => {
    state.value = getter();
  };

  watchDependencies(dependencies, refresh, throttle);

  return [computed(() => state.value), refresh] as const;
}

function computedRefreshableAsync<T>(
  getter: (context: RefreshableAsyncContext) => Promise<T>,
  { defaultValue, dependencies, throttle }: ComputedRefreshableAsyncOptions<T>,
) {
  const state = shallowRef<T>(defaultValue);
  const error = shallowRef<unknown>();
  const isPending = shallowRef(false);
  let activeController: AbortController | undefined;
  let latestJobId = 0;

  const cancel = () => {
    latestJobId += 1;
    activeController?.abort();
    activeController = undefined;
    isPending.value = false;
  };

  const refresh = () => {
    const jobId = latestJobId + 1;
    latestJobId = jobId;
    activeController?.abort();

    const controller = new AbortController();
    activeController = controller;
    error.value = undefined;
    isPending.value = true;

    let job: Promise<T>;

    try {
      job = getter({ signal: controller.signal });
    }
    catch (reason: unknown) {
      error.value = reason;
      isPending.value = false;
      activeController = undefined;
      return;
    }

    void job
      .then((nextValue) => {
        if (jobId === latestJobId && !controller.signal.aborted) {
          state.value = nextValue;
        }
      })
      .catch((reason: unknown) => {
        if (jobId === latestJobId && !controller.signal.aborted) {
          error.value = reason;
        }
      })
      .finally(() => {
        if (jobId === latestJobId) {
          activeController = undefined;
          isPending.value = false;
        }
      });
  };

  watchDependencies(dependencies, refresh, throttle);

  if (getCurrentScope()) {
    onScopeDispose(cancel);
  }

  refresh();

  const asyncState: RefreshableAsyncState = {
    cancel,
    error: computed(() => error.value),
    isPending: computed(() => isPending.value),
  };

  return [computed(() => state.value), refresh, asyncState] as const;
}
