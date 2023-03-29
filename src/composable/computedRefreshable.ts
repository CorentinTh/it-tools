import { computedAsync } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

export { computedRefreshable, computedRefreshableAsync };

function computedRefreshable<T>(getter: () => T) {
  const dirty = ref(true);
  let value: T;

  const update = () => (dirty.value = true);

  watch(getter, update);

  const computedValue = computed(() => {
    if (dirty.value) {
      value = getter();
      dirty.value = false;
    }
    return value;
  });

  return [computedValue, update] as const;
}

function computedRefreshableAsync<T>(getter: () => Promise<T>, defaultValue?: T) {
  const dirty = ref(true);
  let value: T;

  const update = () => (dirty.value = true);

  watch(getter, update);

  const computedValue = computedAsync(async () => {
    if (dirty.value) {
      value = await getter();
      dirty.value = false;
    }
    return value;
  }, defaultValue);

  return [computedValue, update] as const;
}
