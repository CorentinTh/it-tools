<script setup lang="ts">
import unicodeNames from '@unicode/unicode-15.1.0/Names/index.js';
import unicodeCategories from '@unicode/unicode-15.1.0/General_Category';
import utf8 from 'utf8';

import { useFuzzySearch } from '@/composable/fuzzySearch';
import useDebouncedRef from '@/composable/debouncedref';

function toPaddedHex(num: number) {
  return num.toString(16).padStart(4, '0').toUpperCase();
}

function toUTF8(codePoint: number) {
  const utf8String = utf8.encode(String.fromCodePoint(codePoint));
  return [...utf8String].map(c => `\\x${c.codePointAt(0)?.toString(16).toUpperCase()}`);
}

const searchQuery = useDebouncedRef('', 500);
const parsedSearchQuery = computed(() => {
  const parsedRegex = /^\s*(?:\&#x(?<hex1>[\da-f]+);|\&#(?<dec>\d+);|(?:U\+|\\u)?\s*(?<hex2>[\da-f]+))\s*$/gi; // NOSONAR
  const parsedQuery = parsedRegex.exec(searchQuery.value);
  if (parsedQuery) {
    if (parsedQuery.groups?.hex1 || parsedQuery.groups?.hex2) {
      return `=${toPaddedHex(Number.parseInt(parsedQuery.groups.hex1 || parsedQuery.groups.hex2, 16))}`;
    }
    if (parsedQuery.groups?.dec) {
      return `=${toPaddedHex(Number.parseInt(parsedQuery.groups.dec, 10))}`;
    }
  }
  return searchQuery.value;
});

const unicodeSearchData = [...unicodeNames].map(([codePoint, characterName]) => {
  const hex = toPaddedHex(codePoint);
  return {
    codePoint,
    characterName: `${characterName} (U+${hex})`,
    hex,
  };
});

const { searchResult } = useFuzzySearch({
  search: parsedSearchQuery,
  data: unicodeSearchData,
  options: {
    keys: ['characterName', 'hex'],
    threshold: 0.2,
    isCaseSensitive: false,
    minMatchCharLength: 3,
    useExtendedSearch: true,
  },
});
</script>

<template>
  <div mx-auto max-w-2400px important:flex-1>
    <div flex items-center gap-3>
      <c-input-text
        v-model:value="searchQuery"
        placeholder="Search Unicode by name (e.g. 'zero width') or code point..."
        mx-auto max-w-600px
      >
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
    </div>

    <div v-if="searchQuery.trim().length > 0">
      <div
        v-if="searchResult.length === 0"
        mt-4
        text-20px
        font-bold
      >
        No results
      </div>

      <div v-else>
        <div mt-4 text-20px font-bold>
          Search result
        </div>

        <n-table>
          <thead>
            <th>UCOD</th>
            <th>Display/UTF8</th>
            <th style="width:30%">
              Category
            </th>
            <th>Html</th>
            <th style="width:30%">
              Name
            </th>
          </thead>
          <tbody>
            <tr v-for="(result, ix) in searchResult" :key="ix">
              <td>
                <input-copyable :value="`U+${toPaddedHex(result.codePoint)}`" mb-1 />
                <!-- //NOSONAR --><n-a :href="`https://unicodeplus.com/U+${toPaddedHex(result.codePoint)}`" target="_blank">
                  &gt; More info
                </n-a>
              </td>
              <td>
                <input-copyable :value="String.fromCodePoint(result.codePoint)" mb-1 />
                <input-copyable :value="toUTF8(result.codePoint)" />
              </td>
              <td>
                <input-copyable :value="unicodeCategories.get(result.codePoint)" />
              </td>
              <td>
                <input-copyable :value="`\&\#x${toPaddedHex(result.codePoint)};`" mb-1 />
                <input-copyable :value="`\&\#${result.codePoint};`" />
              </td>
              <td><input-copyable :value="result.characterName" /></td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </div>
</template>
