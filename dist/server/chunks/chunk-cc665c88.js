import { watchThrottled, computedAsync } from '@vueuse/core';
import { ref, watch, computed } from 'vue';

function computedRefreshable(getter, { throttle } = {}) {
  const dirty = ref(true);
  let value;
  const update = () => dirty.value = true;
  if (throttle) {
    watchThrottled(getter, update, { throttle });
  } else {
    watch(getter, update);
  }
  const computedValue = computed(() => {
    if (dirty.value) {
      value = getter();
      dirty.value = false;
    }
    return value;
  });
  return [computedValue, update];
}
function computedRefreshableAsync(getter, defaultValue) {
  const dirty = ref(true);
  let value;
  const update = () => dirty.value = true;
  watch(getter, update);
  const computedValue = computedAsync(async () => {
    if (dirty.value) {
      value = await getter();
      dirty.value = false;
    }
    return value;
  }, defaultValue);
  return [computedValue, update];
}

export { computedRefreshableAsync as a, computedRefreshable as c };
