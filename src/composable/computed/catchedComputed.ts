import { type Ref, ref, watchEffect } from 'vue';

export { computedCatch, computedCatchAsync };

function computedCatch<T, D>(getter: () => T, { defaultValue }: { defaultValue: D; defaultErrorMessage?: string }): [Ref<T | D>, Ref<string | undefined>];
function computedCatch<T, D>(getter: () => T, { defaultValue, defaultErrorMessage = 'Unknown error' }: { defaultValue?: D; defaultErrorMessage?: string } = {}) {
  const error = ref<string | undefined>();
  const value = ref<T | D | undefined>();

  watchEffect(() => {
    try {
      error.value = undefined;
      value.value = getter();
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : err?.toString() ?? defaultErrorMessage;
      value.value = defaultValue;
    }
  });

  return [value, error] as const;
}

function computedCatchAsync<T, D>(getterAsync: () => Promise<T>, { defaultValue }: { defaultValue: D; defaultErrorMessage?: string }): [Ref<T | D>, Ref<string | undefined>];
function computedCatchAsync<T, D>(getterAsync: () => Promise<T>, { defaultValue, defaultErrorMessage = 'Unknown error' }: { defaultValue?: D; defaultErrorMessage?: string } = {}) {
  const error = ref<string | undefined>();
  const value = ref<T | D | undefined>();

  watchEffect(async () => {
    try {
      error.value = undefined;
      value.value = await getterAsync();
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : err?.toString() ?? defaultErrorMessage;
      value.value = defaultValue;
    }
  });

  return [value, error] as const;
}
