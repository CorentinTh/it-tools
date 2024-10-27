import { get } from '@vueuse/core';

export function useRefreshableState<T>(key: string, getState: () => T | Ref<T>) {
  const state = useState(key, getState);

  const refresh = () => {
    const value = getState();
    state.value = get(value);
  };

  return [state, refresh] as const;
}
