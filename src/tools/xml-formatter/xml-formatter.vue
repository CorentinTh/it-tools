<script setup lang="ts">
import { createXmlWorkerClient } from './xml-formatter.worker-client';
import { XML_LIVE_MAX_BYTES, XML_MAX_INPUT_BYTES } from './xml-formatter.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useBoundedTextTransform } from '@/composable/bounded-text-transform';
import { downloadTextFile } from '@/composable/downloadText';
import { useResilientStorage } from '@/composable/use-resilient-storage';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';

const defaultValue = '<hello><world>foo</world><world>bar</world></hello>';
const indentSize = useResilientStorage('xml-formatter:indent-size', 2);
const collapseContent = useResilientStorage('xml-formatter:collapse-content', true);
const rawXml = ref(defaultValue);
const inputComponent = ref<{ inputWrapperRef?: HTMLElement }>();
const client = createXmlWorkerClient();
const {
  cancel,
  hasError,
  isRunning,
  output: formattedXml,
  run,
  state,
} = useBoundedTextTransform({
  client,
  createTask: () => ({ collapseContent: collapseContent.value, indentSize: indentSize.value, source: rawXml.value }),
  debounceMs: 250,
  label: 'XML formatting',
  liveMaxBytes: XML_LIVE_MAX_BYTES,
  maxInputBytes: XML_MAX_INPUT_BYTES,
  source: rawXml,
  watchSources: [rawXml, indentSize, collapseContent],
});
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card>
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <CSwitch
          id="xml-collapse-content"
          v-model:value="collapseContent"
          label="Collapse content"
          label-position="top"
        />

        <c-field label="Indent size (0–10)" label-for="xml-indent-size">
          <CInputNumber
            id="xml-indent-size"
            v-model:value="indentSize"
            test-id="xml-indent-size"
            :min="0"
            :max="10"
          />
        </c-field>
      </div>
    </c-card>

    <c-field class="c-tool-panel" label="Your XML">
      <c-input-text
        ref="inputComponent"
        v-model:value="rawXml"
        aria-label="Your XML"
        placeholder="Paste your XML here..."
        rows="20"
        raw-text multiline monospace
        test-id="input"
      />
    </c-field>

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="xml-format-run" :disabled="rawXml.trim() === '' || isRunning" @click="run">
        {{ isRunning ? 'Formatting…' : 'Run XML formatting' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="xml-format-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button :disabled="!formattedXml" data-test-id="xml-format-download" @click="downloadTextFile({ content: formattedXml, filename: 'formatted.xml' })">
        Download
      </c-button>
    </div>
    <p
      v-if="state.message"
      data-test-id="xml-format-status"
      role="status"
      aria-live="polite"
      :class="{ 'status-error': hasError }"
    >
      {{ state.message }}
    </p>

    <c-field class="c-tool-panel" label="Formatted XML from your XML">
      <TextareaCopyable :value="formattedXml" language="xml" :follow-height-of="inputComponent?.inputWrapperRef" />
    </c-field>
  </div>
</template>

<style scoped>
.status-error {
  color: var(--n-feedback-text-color-error);
}
</style>
