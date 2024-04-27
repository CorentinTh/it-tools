import { useRouteQuery } from '@vueuse/router';
import { computed } from 'vue';

const transformers = {
  number: {
    fromQuery: (value) => Number(value),
    toQuery: (value) => String(value)
  },
  string: {
    fromQuery: (value) => value,
    toQuery: (value) => value
  },
  boolean: {
    fromQuery: (value) => value.toLowerCase() === "true",
    toQuery: (value) => value ? "true" : "false"
  }
};
function useQueryParam({ name, defaultValue }) {
  const type = typeof defaultValue;
  const transformer = transformers[type] ?? transformers.string;
  const proxy = useRouteQuery(name, transformer.toQuery(defaultValue));
  return computed({
    get() {
      return transformer.fromQuery(proxy.value);
    },
    set(value) {
      proxy.value = transformer.toQuery(value);
    }
  });
}

export { useQueryParam as u };
