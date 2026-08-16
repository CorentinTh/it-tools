import { type StorageLike, type UseStorageOptions, useStorage } from '@vueuse/core';
import type { MaybeRefOrGetter } from 'vue';
import { resilientLocalStorage } from '@/utils/resilient-storage';

export function useResilientStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {},
) {
  return useStorage(key, defaults, resilientLocalStorage as StorageLike, options);
}
