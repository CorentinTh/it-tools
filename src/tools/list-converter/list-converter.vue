<template>
  <div style="flex: 0 0 100%">
    <n-space item-style="flex: 1 1 0" style="margin: 0 auto; max-width: 600px" justify="center">
      <c-card>
        <div flex>
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
          <div flex-1>
            <n-form-item label="Sort list" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <n-select
                v-model:value="conversionConfig.sortList"
                :options="sortOrderOptions"
                clearable
                w-full
                :disabled="conversionConfig.reverseList"
                data-test-id="sortList"
                placeholder="Sort alphabetically"
              />
            </n-form-item>

            <n-form-item label="Separator" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <n-input v-model:value="conversionConfig.separator" placeholder="," />
            </n-form-item>

            <n-form-item label="Wrap item" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <n-input-group>
                <n-input
                  v-model:value="conversionConfig.itemPrefix"
                  placeholder="Item prefix"
                  data-test-id="itemPrefix"
                />
                <n-input
                  v-model:value="conversionConfig.itemSuffix"
                  placeholder="Item suffix"
                  data-test-id="itemSuffix"
                />
              </n-input-group>
            </n-form-item>
            <n-form-item label="Wrap list" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <n-input-group>
                <n-input
                  v-model:value="conversionConfig.listPrefix"
                  placeholder="List prefix"
                  data-test-id="listPrefix"
                />
                <n-input
                  v-model:value="conversionConfig.listSuffix"
                  placeholder="List suffix"
                  data-test-id="listSuffix"
                />
              </n-input-group>
            </n-form-item>
          </div>
        </div>
      </c-card>
    </n-space>
  </div>
  <format-transformer
    input-label="Your input data"
    input-placeholder="Paste your input data here..."
    output-label="Your transformed data"
    :transformer="transformer"
  />
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { convert } from './list-converter.models';
import type { ConvertOptions } from './list-converter.types';

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

const transformer = (value: string) => {
  return convert(value, conversionConfig.value);
};
</script>

<style lang="less" scoped></style>
