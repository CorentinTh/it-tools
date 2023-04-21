<template>
  <n-form-item label="Your first json" v-bind="leftJsonValidation.attrs">
    <n-input
      v-model:value="rawLeftJson"
      placeholder="Paste your first json here..."
      type="textarea"
      rows="20"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :input-props="{ 'data-test-id': 'leftJson' }"
    />
  </n-form-item>
  <n-form-item label="Your json to compare" v-bind="rightJsonValidation.attrs">
    <n-input
      v-model:value="rawRightJson"
      placeholder="Paste your json to compare here..."
      type="textarea"
      rows="20"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :input-props="{ 'data-test-id': 'rightJson' }"
    />
  </n-form-item>

  <DiffsViewer :left-json="leftJson" :right-json="rightJson" />
</template>

<script setup lang="ts">
import JSON5 from 'json5';

import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import DiffsViewer from './diff-viewer/diff-viewer.vue';

const rawLeftJson = ref('');
const rawRightJson = ref('');

const leftJson = computed(() => withDefaultOnError(() => JSON5.parse(rawLeftJson.value), undefined));
const rightJson = computed(() => withDefaultOnError(() => JSON5.parse(rawRightJson.value), undefined));

const createJsonValidation = (json: Ref) =>
  useValidation({
    source: json,
    rules: [
      {
        validator: (value) => value === '' || isNotThrowing(() => JSON5.parse(value)),
        message: 'Invalid JSON',
      },
    ],
  });

const leftJsonValidation = createJsonValidation(rawLeftJson);
const rightJsonValidation = createJsonValidation(rawRightJson);
</script>
