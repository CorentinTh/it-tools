<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { convert } from './list-converter.models';
import type { ConvertOptions } from './list-converter.types';

const sortOrderOptions = [
  {
    label: 'No Sort',
    value: null,
  },
  {
    label: 'Sort ascending',
    value: 'asc',
  },
  {
    label: 'Sort descending',
    value: 'desc',
  },
  {
    label: 'Sort asc (Numeric)',
    value: 'asc-num',
  },
  {
    label: 'Sort desc (Numeric)',
    value: 'desc-num',
  },
  {
    label: 'Sort asc (Upper)',
    value: 'asc-upper',
  },
  {
    label: 'Sort desc (Upper)',
    value: 'desc-upper',
  },
  {
    label: 'Sort asc (Binary)',
    value: 'asc-bin',
  },
  {
    label: 'Sort desc (Binary)',
    value: 'desc-bin',
  },
];

const conversionConfig = useStorage<ConvertOptions>('list-converter:conversionConfig', {
  lowerCase: false,
  trimItems: true,
  removeDuplicates: true,
  keepLineBreaks: false,
  itemPrefix: '',
  itemSuffix: '',
  removeItemPrefix: '',
  removeItemSuffix: '',
  listPrefix: '',
  listSuffix: '',
  reverseList: false,
  sortList: null,
  itemsSeparator: ', ',
  splitBySeparator: '',
});

function transformer(value: string) {
  return convert(value, conversionConfig.value);
}
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px">
      <c-card>
        <n-space>
          <div>
            <n-form-item label="Trim list items" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.trimItems" />
            </n-form-item>
            <n-form-item label="Remove duplicates" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.removeDuplicates" data-test-id="removeDuplicates" />
            </n-form-item>
            <n-form-item
              label="Convert to lowercase"
              label-placement="left"
              label-width="150"
              :show-feedback="false"
              mb-2
            >
              <n-switch v-model:value="conversionConfig.lowerCase" />
            </n-form-item>
            <n-form-item label="Keep line breaks" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.keepLineBreaks" />
            </n-form-item>
          </div>
          <div>
            <c-select
              v-model:value="conversionConfig.sortList"
              label="Sort list"
              label-position="left"
              label-width="120px"
              label-align="right"
              mb-2
              :options="sortOrderOptions"
              w-full
              :disabled="conversionConfig.reverseList"
              data-test-id="sortList"
              placeholder="Sort alphabetically"
            />

            <c-input-text
              v-model:value="conversionConfig.itemsSeparator"
              label="Items Separator"
              label-position="left"
              label-width="120px"
              label-align="right"
              mb-2
              placeholder="Items separator"
            />

            <c-input-text
              v-model:value="conversionConfig.splitBySeparator"
              label="Split Separator"
              label-position="left"
              label-width="120px"
              label-align="right"
              mb-2
              placeholder="Separator for splitting"
            />

            <n-form-item label="Unwrap item" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <c-input-text
                v-model:value="conversionConfig.removeItemPrefix"
                placeholder="Remove item prefix regex"
                test-id="removeItemPrefix"
              />
              <c-input-text
                v-model:value="conversionConfig.removeItemSuffix"
                placeholder="Remove item suffix regex"
                test-id="removeItemSuffix"
              />
            </n-form-item>

            <n-form-item label="Wrap item" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <c-input-text
                v-model:value="conversionConfig.itemPrefix"
                placeholder="Item prefix"
                test-id="itemPrefix"
              />
              <c-input-text
                v-model:value="conversionConfig.itemSuffix"
                placeholder="Item suffix"
                test-id="itemSuffix"
              />
            </n-form-item>
            <n-form-item label="Wrap list" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <c-input-text
                v-model:value="conversionConfig.listPrefix"
                placeholder="List prefix"
                test-id="listPrefix"
              />
              <c-input-text
                v-model:value="conversionConfig.listSuffix"
                placeholder="List suffix"
                test-id="listSuffix"
              />
            </n-form-item>
          </div>
        </n-space>
      </c-card>
    </div>
  </div>
  <format-transformer
    input-label="Your input data"
    input-placeholder="Paste your input data here..."
    output-label="Your transformed data"
    :transformer="transformer"
  />
</template>
