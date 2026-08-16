<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import type { ConvertOptions } from './list-converter.types';
import { createListConverterWorkerClient } from './list-converter.worker-client';
import { LIST_CONVERTER_LIVE_MAX_BYTES, LIST_CONVERTER_MAX_INPUT_BYTES } from './list-converter.worker.protocol';
import CSwitch from '@/ui/c-switch/c-switch.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useBoundedTextTransform } from '@/composable/bounded-text-transform';

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

const conversionConfig = useStorage<ConvertOptions>('it-tools:list-converter:preferences:v1', {
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

const source = ref('');
const inputComponent = ref<{ inputWrapperRef?: HTMLElement }>();
const client = createListConverterWorkerClient();
const { cancel, hasError, isRunning, output, run, state } = useBoundedTextTransform({
  client,
  createTask: () => ({ options: { ...conversionConfig.value }, source: source.value }),
  debounceMs: 250,
  label: 'List conversion',
  liveMaxBytes: LIST_CONVERTER_LIVE_MAX_BYTES,
  maxInputBytes: LIST_CONVERTER_MAX_INPUT_BYTES,
  source,
  watchSources: [
    source,
    () => conversionConfig.value.itemPrefix,
    () => conversionConfig.value.itemSuffix,
    () => conversionConfig.value.keepLineBreaks,
    () => conversionConfig.value.listPrefix,
    () => conversionConfig.value.listSuffix,
    () => conversionConfig.value.lowerCase,
    () => conversionConfig.value.removeDuplicates,
    () => conversionConfig.value.reverseList,
    () => conversionConfig.value.separator,
    () => conversionConfig.value.sortList,
    () => conversionConfig.value.trimItems,
  ],
});
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

    <c-input-text
      ref="inputComponent"
      v-model:value="source"
      class="c-tool-panel"
      label="Your input data"
      placeholder="Paste your input data here..."
      rows="20"
      raw-text
      multiline
      test-id="input"
      monospace
    />
    <div class="c-task-actions">
      <c-button type="primary" data-test-id="list-converter-run" :disabled="source === '' || isRunning" @click="run">
        {{ isRunning ? 'Converting…' : 'Run list conversion' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="list-converter-cancel" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p
      v-if="state.message"
      data-test-id="list-converter-status"
      role="status"
      aria-live="polite"
      :class="{ 'status-error': hasError }"
    >
      {{ state.message }}
    </p>
    <c-field class="c-tool-panel" label="Your transformed data">
      <TextareaCopyable
        :value="output"
        :large-preview-bytes="8 * 1024"
        :follow-height-of="inputComponent?.inputWrapperRef"
      />
    </c-field>
  </div>
</template>

<style scoped>
.status-error {
  color: var(--n-feedback-text-color-error);
}
</style>
