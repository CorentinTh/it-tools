import { type MaybeRef, get } from '@vueuse/core';
import Fuse from 'fuse.js';
import { computed } from 'vue';

export { useFuzzySearch };

function useFuzzySearch<Data>({
  search,
  data,
  options = {},
}: {
  search: MaybeRef<string>
  data: Data[]
  options?: Fuse.IFuseOptions<Data> & { filterEmpty?: boolean }
}) {
  const fuse = new Fuse(data, options);
  const filterEmpty = options.filterEmpty ?? true;

  const searchResult = computed<Data[]>(() => {
    const query = get(search);

    if (!filterEmpty && query === '') {
      return data;
    }

    return fuse.search(query).map(({ item }) => item);
  });

  return { searchResult };
}
