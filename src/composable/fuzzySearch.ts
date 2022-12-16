import { get, type MaybeRef } from '@vueuse/core';
import Fuse from 'fuse.js';
import { computed } from 'vue';

export { useFuzzySearch };

function useFuzzySearch<Data>({
  search,
  data,
  options = {},
}: {
  search: MaybeRef<string>;
  data: Data[];
  options?: Fuse.IFuseOptions<Data>;
}) {
  const fuse = new Fuse(data, options);

  const searchResult = computed(() => {
    return fuse.search(get(search)).map(({ item }) => item);
  });

  return { searchResult };
}
