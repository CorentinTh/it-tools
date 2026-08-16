function useDebouncedRef<T>(initialValue: T, delay: number, immediate: boolean = false) {
  let currentValue = initialValue;
  let timer: ReturnType<typeof globalThis.setTimeout> | undefined;
  let pendingValue = initialValue;
  let needsTrailingUpdate = false;
  const debouncedRef = customRef((track, trigger) => {
    const publish = () => {
      currentValue = pendingValue;
      trigger();
    };

    return {
      get() {
        track();
        return currentValue;
      },
      set(value) {
        pendingValue = value;
        if (timer === undefined && immediate) {
          publish();
          needsTrailingUpdate = false;
        }
        else {
          needsTrailingUpdate = true;
        }

        if (timer !== undefined) {
          globalThis.clearTimeout(timer);
        }
        timer = globalThis.setTimeout(() => {
          timer = undefined;
          if (!immediate || needsTrailingUpdate) {
            publish();
          }
          needsTrailingUpdate = false;
        }, delay);
      },
    };
  });

  if (getCurrentScope()) {
    onScopeDispose(() => {
      if (timer !== undefined) {
        globalThis.clearTimeout(timer);
      }
    });
  }
  return debouncedRef;
}
export default useDebouncedRef;
