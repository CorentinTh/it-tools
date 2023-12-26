<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { convert } from './list-converter.models';
import type { ConvertOptions } from './list-converter.types';

const { t } = useI18n();

const sortOrderOptions = [
  {
    label: t('tools.list-converter.sortOrder.asc'),
    value: 'asc',
    disabled: false,
  },
  {
    label: t('tools.list-converter.sortOrder.desc'),
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
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px">
      <c-card>
        <div flex>
          <div>
            <n-form-item :label="t('tools.list-converter.trimListItems')" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.trimItems" />
            </n-form-item>
            <n-form-item :label="t('tools.list-converter.removeDuplicates')" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.removeDuplicates" data-test-id="removeDuplicates" />
            </n-form-item>
            <n-form-item
              :label="t('tools.list-converter.convertToLowercase')"
              label-placement="left"
              label-width="150"
              :show-feedback="false"
              mb-2
            >
              <n-switch v-model:value="conversionConfig.lowerCase" />
            </n-form-item>
            <n-form-item :label="t('tools.list-converter.keepLineBreaks')" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.keepLineBreaks" />
            </n-form-item>
          </div>
          <div flex-1>
            <c-select
              v-model:value="conversionConfig.sortList"
              :label="t('tools.list-converter.sortListLabel')"
              label-position="left"
              label-width="120px"
              label-align="right"
              mb-2
              :options="sortOrderOptions"
              w-full
              :disabled="conversionConfig.reverseList"
              data-test-id="sortList"
              :placeholder="t('tools.list-converter.sortListPlaceholder')"
            />

            <c-input-text
              v-model:value="conversionConfig.separator"
              :label="t('tools.list-converter.separatorLabel')"
              label-position="left"
              label-width="120px"
              label-align="right"
              mb-2
              :placeholder="t('tools.list-converter.separatorPlaceholder')"
            />

            <n-form-item :label="t('tools.list-converter.wrapItem')" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <c-input-text
                v-model:value="conversionConfig.itemPrefix"
                :placeholder="t('tools.list-converter.itemPrefix')"
                test-id="itemPrefix"
              />
              <c-input-text
                v-model:value="conversionConfig.itemSuffix"
                :placeholder="t('tools.list-converter.itemSuffix')"
                test-id="itemSuffix"
              />
            </n-form-item>
            <n-form-item label="Wrap list" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <c-input-text
                v-model:value="conversionConfig.listPrefix"
                :placeholder="t('tools.list-converter.listPrefix')"
                test-id="listPrefix"
              />
              <c-input-text
                v-model:value="conversionConfig.listSuffix"
                :placeholder="t('tools.list-converter.listSuffix')"
                test-id="listSuffix"
              />
            </n-form-item>
          </div>
        </div>
      </c-card>
    </div>
  </div>
  <format-transformer
    :input-label="t('tools.list-converter.inputLabel')"
    :input-placeholder="t('tools.list-converter.inputPlaceholder')"
    :output-label="t('tools.list-converter.outputLabel')"
    :transformer="transformer"
  />
</template>
