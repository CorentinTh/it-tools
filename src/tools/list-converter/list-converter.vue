<template>
  <div style="flex: 0 0 100%">
    <n-space item-style="flex: 1 1 0" style="margin: 0 auto; max-width: 600px" justify="center">
      <c-card>
        <n-grid cols="1 400:2" x-gap="12" y-gap="12">
          <n-form-item-gi label="Trim list items" label-placement="left" label-width="180">
            <n-switch v-model:value="trimItems" />
          </n-form-item-gi>
          <n-form-item-gi label="Remove duplicate list items" label-placement="left" label-width="180">
            <n-switch v-model:value="removeDuplicates" data-test-id="removeDuplicates" />
          </n-form-item-gi>
          <n-form-item-gi label="Convert items to lowercase" label-placement="left" label-width="180">
            <n-switch v-model:value="lowerCase" />
          </n-form-item-gi>
          <n-form-item-gi label="Keep line breaks" label-placement="left" label-width="180">
            <n-switch v-model:value="keepLineBreaks" />
          </n-form-item-gi>
          <n-form-item-gi label="Sort list" label-placement="left" label-width="180">
            <n-select
              v-model:value="sortList"
              :options="sortOrderOptions"
              clearable
              :disabled="reverseList"
              data-test-id="sortList"
            />
          </n-form-item-gi>
          <n-form-item-gi label="Reverse list" label-placement="left" label-width="180">
            <n-switch v-model:value="reverseList" :disabled="sortList !== null" data-test-id="reverseList" />
          </n-form-item-gi>
          <n-form-item-gi label="Item prefix" label-placement="left" label-width="180">
            <n-input v-model:value="itemPrefix" placeholder="<li>" data-test-id="itemPrefix" />
          </n-form-item-gi>
          <n-form-item-gi label="Item suffix" label-placement="left" label-width="180">
            <n-input v-model:value="itemSuffix" placeholder="</li>" data-test-id="itemSuffix" />
          </n-form-item-gi>
          <n-form-item-gi label="List prefix" label-placement="left" label-width="180">
            <n-input v-model:value="listPrefix" placeholder="<ul>" />
          </n-form-item-gi>
          <n-form-item-gi label="List suffix" label-placement="left" label-width="180">
            <n-input v-model:value="listSuffix" placeholder="</ul>" />
          </n-form-item-gi>
          <n-form-item-gi label="Separator" label-placement="left" label-width="180">
            <n-input v-model:value="separator" placeholder="," />
          </n-form-item-gi>
        </n-grid>
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

const sortOrderOptions = [
  {
    label: 'Asc',
    value: 'asc',
    disabled: false,
  },
  {
    label: 'Desc',
    value: 'desc',
    disabled: false,
  },
];

const lowerCase = useStorage('list-converter--lowerCase', false);
const trimItems = useStorage('list-converter--trimItems', true);
const removeDuplicates = useStorage('list-converter--removeDuplicates', true);
const keepLineBreaks = useStorage('list-converter--keepLineBreaks', false);
const itemPrefix = useStorage('list-converter--itemPrefix', '');
const itemSuffix = useStorage('list-converter--itemSuffix', '');
const listPrefix = useStorage('list-converter--listPrefix', '');
const listSuffix = useStorage('list-converter--listSuffix', '');
const reverseList = useStorage('list-converter--reverseList', false);
const sortList = useStorage('list-converter--sortList', null);
const separator = useStorage('list-converter--separator', ', ');

const transformer = (value: string) => {
  return convert(value, {
    lowerCase: lowerCase.value,
    trimItems: trimItems.value,
    removeDuplicates: removeDuplicates.value,
    keepLineBreaks: keepLineBreaks.value,
    itemPrefix: itemPrefix.value,
    itemSuffix: itemSuffix.value,
    listPrefix: listPrefix.value,
    listSuffix: listSuffix.value,
    reverseList: reverseList.value,
    sortList: sortList.value,
    separator: separator.value,
  });
};
</script>

<style lang="less" scoped></style>
