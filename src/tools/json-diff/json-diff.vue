<script setup lang="ts">
import JSON5 from 'json5';
import DiffsViewer from './diff-viewer/diff-viewer.vue';
import { withDefaultOnError } from '@/utils/defaults';
import { isNotThrowing } from '@/utils/boolean';

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

<template>
  <div class="c-tool-workbench c-diff-layout">
    <c-input-text
      v-model:value="rawLeftJson"
      :validation-rules="jsonValidationRules"
      label="Your first JSON"
      placeholder="Paste your first JSON here..."
      rows="20"
      multiline
      test-id="leftJson"
      raw-text
      monospace
    />

    <c-input-text
      v-model:value="rawRightJson"
      :validation-rules="jsonValidationRules"
      label="Your JSON to compare"
      placeholder="Paste your JSON to compare here..."
      rows="20"
      multiline
      test-id="rightJson"
      raw-text
      monospace
    />

    <DiffsViewer class="diff-result" :left-json="leftJson" :right-json="rightJson" />
  </div>
</template>

<style scoped>
.c-diff-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ui-space-4);
}

.diff-result {
  grid-column: 1 / -1;
}

@media (max-width: 800px) {
  .c-diff-layout {
    grid-template-columns: 1fr;
  }
}
</style>
