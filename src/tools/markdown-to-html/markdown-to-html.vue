<script setup lang="ts">
import { createMarkdownWorkerClient } from './markdown-to-html.worker-client';
import { MARKDOWN_LIVE_MAX_BYTES, MARKDOWN_MAX_INPUT_BYTES } from './markdown-to-html.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useBoundedTextTransform } from '@/composable/bounded-text-transform';

const inputMarkdown = ref('');
const client = createMarkdownWorkerClient();
const {
  cancel,
  hasError,
  isRunning,
  output: outputHtml,
  run,
  state,
} = useBoundedTextTransform({
  client,
  createTask: () => ({ source: inputMarkdown.value }),
  debounceMs: 250,
  label: 'Markdown rendering',
  liveMaxBytes: MARKDOWN_LIVE_MAX_BYTES,
  maxInputBytes: MARKDOWN_MAX_INPUT_BYTES,
  source: inputMarkdown,
  watchSources: [inputMarkdown],
});

function printHtml() {
  const w = window.open();
  if (w === null) {
    return;
  }
  w.document.body.innerHTML = outputHtml.value;
  w.print();
}
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-input-text
      v-model:value="inputMarkdown"
      multiline raw-text
      placeholder="Your Markdown content..."
      rows="8"
      autofocus
      label="Your Markdown to convert:"
    />

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="markdown-run" :disabled="inputMarkdown === '' || isRunning" @click="run">
        {{ isRunning ? 'Rendering…' : 'Run Markdown rendering' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="markdown-cancel" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p
      v-if="state.message"
      data-test-id="markdown-status"
      role="status"
      aria-live="polite"
      :class="{ 'status-error': hasError }"
    >
      {{ state.message }}
    </p>

    <c-field class="c-tool-panel" label="Output HTML">
      <TextareaCopyable :value="outputHtml" :word-wrap="true" language="html" />
    </c-field>

    <div class="c-generator-actions">
      <c-button :disabled="outputHtml === ''" @click="printHtml">
        Print as PDF
      </c-button>
    </div>
  </div>
</template>

<style scoped>
.status-error {
  color: var(--n-feedback-text-color-error);
}
</style>
