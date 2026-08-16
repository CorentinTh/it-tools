<script setup lang="ts">
import type { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import {
  STRUCTURED_CONVERTER_LIVE_MAX_BYTES,
  STRUCTURED_CONVERTER_MAX_INPUT_BYTES,
  type StructuredDataConversion,
  type StructuredDataConversionTask,
} from '@/utils/structured-data-converter.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { downloadTextFile } from '@/composable/downloadText';
import { useBoundedTextTransform } from '@/composable/bounded-text-transform';

const props = withDefaults(defineProps<{
  conversion: StructuredDataConversion
  createClient: () => BoundedTextWorkerClient<StructuredDataConversionTask>
  downloadFilename: string
  inputDefault?: string
  inputLabel: string
  inputPlaceholder: string
  outputLabel: string
  outputLanguage: string
  taskLabel: string
}>(), {
  inputDefault: '',
});

const source = ref(props.inputDefault);
const inputComponent = ref<{ inputWrapperRef?: HTMLElement }>();
const client = props.createClient();
const {
  cancel,
  hasError,
  isRunning,
  output,
  run,
  state,
} = useBoundedTextTransform({
  client,
  createTask: () => ({ conversion: props.conversion, source: source.value }),
  debounceMs: 250,
  label: props.taskLabel,
  liveMaxBytes: STRUCTURED_CONVERTER_LIVE_MAX_BYTES,
  maxInputBytes: STRUCTURED_CONVERTER_MAX_INPUT_BYTES,
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
      :placeholder="inputPlaceholder"
      :label="inputLabel"
      rows="20"
      raw-text
      multiline
      test-id="input"
      monospace
    />

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="converter-run" :disabled="source.trim() === '' || isRunning" @click="run">
        {{ isRunning ? 'Converting…' : `Run ${taskLabel}` }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="converter-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button :disabled="!output" data-test-id="converter-download" @click="downloadTextFile({ content: output, filename: downloadFilename })">
        Download
      </c-button>
    </div>
    <p
      v-if="state.message"
      data-test-id="converter-status"
      role="status"
      aria-live="polite"
      :class="{ 'status-error': hasError }"
    >
      {{ state.message }}
    </p>

    <c-field class="c-tool-panel" :label="outputLabel">
      <TextareaCopyable
        :value="output"
        :language="outputLanguage"
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
