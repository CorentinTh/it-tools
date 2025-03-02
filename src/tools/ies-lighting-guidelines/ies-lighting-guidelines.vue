<script setup lang="ts">
import iesData from './ies-lighting-data.json';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import useDebouncedRef from '@/composable/debouncedref';

const data = iesData.map(i => ({ ...i, all: `${i.industryType} - ${i.industryApplication}` }));
const searchQuery = useDebouncedRef('', 500);

const { searchResult } = useFuzzySearch({
  search: searchQuery,
  data,
  options: {
    keys: ['all'],
    threshold: 0.2,
    isCaseSensitive: false,
    minMatchCharLength: 3,
    useExtendedSearch: true,
    filterEmpty: false,
  },
});
</script>

<template>
  <div mx-auto max-w-2400px important:flex-1>
    <div flex items-center gap-3>
      <c-input-text
        v-model:value="searchQuery"
        placeholder="Search IES recommandation by industry or application"
        mx-auto max-w-600px
      >
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
    </div>

    <n-p style="text-align: center">
      Individual applications will determine exact foot-candle levels. Please refer to the <n-a href="https://www.ies.org/standards/lighting-library/" target="_blank">
        IES Lighting Handbook
      </n-a> for a more detailed evaluation
    </n-p>

    <div>
      <div
        v-if="searchResult.length === 0"

        mt-4 text-center text-20px font-bold
      >
        No results
      </div>

      <div v-else>
        <div mt-4 text-20px font-bold>
          Search result
        </div>

        <n-table>
          <thead>
            <th>Industry</th>
            <th>Application</th>
            <th>Foot Candles</th>
            <th>Lighting type</th>
          </thead>
          <tbody>
            <tr v-for="(result, ix) in searchResult" :key="ix">
              <td>
                <input-copyable :value="result.industryType" />
              </td>
              <td>
                <input-copyable :value="result.industryApplication" />
              </td>
              <td>
                <input-copyable :value="result.footCandlesRange" />
              </td>
              <td>
                <input-copyable :value="result.recommendedLighting" />
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </div>
</template>
