<template>
  <c-input-text
    v-model:value="rawLeftJson"
    :validation-rules="jsonValidationRules"
    label="Your first json"
    placeholder="Paste your first json here..."
    rows="20"
    multiline
    test-id="leftJson"
    raw-text
  />

  <c-input-text
    v-model:value="rawRightJson"
    :validation-rules="jsonValidationRules"
    label="Your json to compare"
    placeholder="Paste your json to compare here..."
    rows="20"
    multiline
    test-id="rightJson"
    raw-text
  />

  <DiffsViewer :left-json="leftJson" :right-json="rightJson" />
</template>

<script setup lang="ts">
import JSON5 from 'json5';

import { withDefaultOnError } from '@/utils/defaults';
import { isNotThrowing } from '@/utils/boolean';
import DiffsViewer from './diff-viewer/diff-viewer.vue';

const rawLeftJson = ref('');
const rawRightJson = ref('');

const leftJson = computed(() => withDefaultOnError(() => JSON5.parse(rawLeftJson.value), undefined));
const rightJson = computed(() => withDefaultOnError(() => JSON5.parse(rawRightJson.value), undefined));

const jsonValidationRules = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => JSON5.parse(value)),
    message: 'Invalid JSON format',
  },
];
</script>
