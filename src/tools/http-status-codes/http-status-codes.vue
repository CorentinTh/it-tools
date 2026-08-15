<script setup lang="ts">
import { codesByCategories } from './http-status-codes.constants';
import { useFuzzySearch } from '@/composable/fuzzySearch';

const search = ref('');

const { searchResult } = useFuzzySearch({
  search,
  data: codesByCategories.flatMap(({ codes, category }) => codes.map(code => ({ ...code, category }))),
  options: {
    keys: [{ name: 'code', weight: 3 }, { name: 'name', weight: 2 }, 'description', 'category'],
  },
});

const codesByCategoryFiltered = computed(() => {
  if (!search.value) {
    return codesByCategories;
  }

  return [{ category: 'Search results', codes: searchResult.value }];
});
</script>

<template>
  <div class="c-form-layout">
    <c-card title="Search">
      <c-input-text
        v-model:value="search"
        label="HTTP status code, name, or description"
        placeholder="Search HTTP status..."
        autofocus
        raw-text
      />
    </c-card>

    <section v-for="{ codes, category } of codesByCategoryFiltered" :key="category">
      <h2 mb-2 text-xl>
        {{ category }}
      </h2>

      <c-card v-for="{ code, description, name, type } of codes" :key="code" mb-2>
        <div text-lg font-bold>
          {{ code }} {{ name }}
        </div>
        <div op-70>
          {{ description }} {{ type !== 'HTTP' ? `For ${type}.` : '' }}
        </div>
      </c-card>
    </section>
  </div>
</template>
