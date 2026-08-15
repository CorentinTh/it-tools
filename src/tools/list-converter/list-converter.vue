<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { convert } from './list-converter.models';
import type { ConvertOptions } from './list-converter.types';
import CSwitch from '@/ui/c-switch/c-switch.vue';

const sortOrderOptions = [
  {
    label: 'Sort ascending',
    value: 'asc',
    disabled: false,
  },
  {
    label: 'Sort descending',
    value: 'desc',
    disabled: false,
  },
];

const conversionConfig = useStorage<ConvertOptions>('list-converter:conversionConfig', {
  lowerCase: false,
  trimItems: true,
  removeDuplicates: true,
  keepLineBreaks: false,
  itemPrefix: '',
  itemSuffix: '',
  listPrefix: '',
  listSuffix: '',
  reverseList: false,
  sortList: null,
  separator: ', ',
});

function transformer(value: string) {
  return convert(value, conversionConfig.value);
}
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card>
      <div grid grid-cols-1 gap-6 md:grid-cols-2>
        <section aria-label="List behavior" flex flex-col gap-3>
          <CSwitch id="list-trim" v-model:value="conversionConfig.trimItems" label="Trim list items" />
          <CSwitch
            id="list-deduplicate"
            v-model:value="conversionConfig.removeDuplicates"
            label="Remove duplicates"
            test-id="removeDuplicates"
          />
          <CSwitch id="list-lowercase" v-model:value="conversionConfig.lowerCase" label="Convert to lowercase" />
          <CSwitch id="list-line-breaks" v-model:value="conversionConfig.keepLineBreaks" label="Keep line breaks" />
        </section>

        <section aria-label="List formatting" grid grid-cols-1 gap-3 sm:grid-cols-2>
          <c-select
            v-model:value="conversionConfig.sortList"
            label="Sort list"
            :options="sortOrderOptions"
            :disabled="conversionConfig.reverseList"
            data-test-id="sortList"
            placeholder="Sort alphabetically"
          />

          <c-input-text
            v-model:value="conversionConfig.separator"
            label="Separator"
            placeholder=","
          />

          <c-input-text
            v-model:value="conversionConfig.itemPrefix"
            label="Item prefix"
            placeholder="Item prefix"
            test-id="itemPrefix"
          />
          <c-input-text
            v-model:value="conversionConfig.itemSuffix"
            label="Item suffix"
            placeholder="Item suffix"
            test-id="itemSuffix"
          />
          <c-input-text
            v-model:value="conversionConfig.listPrefix"
            label="List prefix"
            placeholder="List prefix"
            test-id="listPrefix"
          />
          <c-input-text
            v-model:value="conversionConfig.listSuffix"
            label="List suffix"
            placeholder="List suffix"
            test-id="listSuffix"
          />
        </section>
      </div>
    </c-card>

    <format-transformer
      input-label="Your input data"
      input-placeholder="Paste your input data here..."
      output-label="Your transformed data"
      :transformer="transformer"
    />
  </div>
</template>
