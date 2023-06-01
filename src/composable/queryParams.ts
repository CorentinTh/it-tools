import { useRouteQuery } from '@vueuse/router';
import { computed } from 'vue';

export { useQueryParam };

const transformers = {
  number: {
    fromQuery: (value: string) => Number(value),
    toQuery: (value: number) => String(value),
  },
  string: {
    fromQuery: (value: string) => value,
    toQuery: (value: string) => value,
  },
  boolean: {
    fromQuery: (value: string) => value.toLowerCase() === 'true',
    toQuery: (value: boolean) => (value ? 'true' : 'false'),
  },
};

function useQueryParam<T>({ name, defaultValue }: { name: string; defaultValue: T }) {
  const type = typeof defaultValue;
  const transformer = transformers[type as keyof typeof transformers] ?? transformers.string;

  const proxy = useRouteQuery(name, transformer.toQuery(defaultValue as never));

  return computed<T>({
    get() {
      return transformer.fromQuery(proxy.value) as unknown as T;
    },
    set(value) {
      proxy.value = transformer.toQuery(value as never);
    },
  });
}
