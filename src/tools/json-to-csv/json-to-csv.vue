<script setup lang="ts">
import { createJsonToCsvWorkerClient } from './json-to-csv.worker-client';
import { JSON_TO_CSV_LIVE_MAX_BYTES, JSON_TO_CSV_MAX_INPUT_BYTES } from './json-to-csv.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useBoundedTextTransform } from '@/composable/bounded-text-transform';
import { downloadTextFile } from '@/composable/downloadText';

const source = ref('');
const inputComponent = ref<{ inputWrapperRef?: HTMLElement }>();
const client = createJsonToCsvWorkerClient();
const { cancel, hasError, isRunning, output, run, state } = useBoundedTextTransform({
  client,
  createTask: () => ({ source: source.value }),
  debounceMs: 250,
  label: 'JSON-to-CSV conversion',
  liveMaxBytes: JSON_TO_CSV_LIVE_MAX_BYTES,
  maxInputBytes: JSON_TO_CSV_MAX_INPUT_BYTES,
  source,
  watchSources: [source],
});
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-input-text
      ref="inputComponent"
      v-model:value="source"
      class="c-tool-panel"
      label="Your raw JSON"
      placeholder="Paste your raw JSON here..."
      rows="20"
      raw-text
      multiline
      test-id="input"
      monospace
    />
    <div class="c-task-actions">
      <c-button type="primary" data-test-id="json-to-csv-run" :disabled="source.trim() === '' || isRunning" @click="run">
        {{ isRunning ? 'Converting…' : 'Run JSON-to-CSV conversion' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="json-to-csv-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button :disabled="!output" data-test-id="json-to-csv-download" @click="downloadTextFile({ content: output, filename: 'converted.csv' })">
        Download
      </c-button>
    </div>
    <p
      v-if="state.message"
      data-test-id="json-to-csv-status"
      role="status"
      aria-live="polite"
      :class="{ 'status-error': hasError }"
    >
      {{ state.message }}
    </p>
    <c-field class="c-tool-panel" label="CSV version of your JSON">
      <TextareaCopyable
        :value="output"
        :large-preview-bytes="16 * 1024"
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
