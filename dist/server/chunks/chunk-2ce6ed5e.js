import { get } from '@vueuse/core';
import Fuse from 'fuse.js';
import { computed } from 'vue';

function useFuzzySearch({
  search,
  data,
  options = {}
}) {
  const fuse = new Fuse(data, options);
  const filterEmpty = options.filterEmpty ?? true;
  const searchResult = computed(() => {
    const query = get(search);
    if (!filterEmpty && query === "") {
      return data;
    }
    return fuse.search(query).map(({ item }) => item);
  });
  return { searchResult };
}

export { useFuzzySearch as u };
