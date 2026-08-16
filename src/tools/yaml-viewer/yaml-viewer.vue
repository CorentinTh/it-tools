<script setup lang="ts">
import { YamlWorkerClient } from './yaml-viewer.worker-client';
import {
  YAML_FORMAT_DEBOUNCE_MS,
  YAML_LIVE_FORMAT_MAX_BYTES,
  YAML_MAX_INPUT_BYTES,
  toYamlTaskError,
} from './yaml-viewer.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { downloadTextFile } from '@/composable/downloadText';
import { useResilientStorage } from '@/composable/use-resilient-storage';

const inputComponent = ref<{ inputWrapperRef?: HTMLElement }>();

const rawYaml = ref('');
const indentSize = useResilientStorage('yaml-prettify:indent-size', 2);
const sortKeys = useResilientStorage('yaml-prettify:sort-keys', false);
const cleanYaml = shallowRef('null\n');
const requiresExplicitFormat = ref(false);
const workerClient = new YamlWorkerClient();

type FormatStatus = 'idle' | 'pending' | 'running' | 'success' | 'cancelled' | 'timeout' | 'error';

const formatState = reactive<{
  status: FormatStatus
  message: string
  elapsedMs: number
}>({
  status: 'idle',
  message: '',
  elapsedMs: 0,
});

let formatTimer: ReturnType<typeof globalThis.setTimeout> | undefined;
let latestRequestId = 0;

const hasValidationError = computed(() => formatState.status === 'error' || formatState.status === 'timeout');
const canCancel = computed(() =>
  formatState.status === 'running'
  || (formatState.status === 'pending' && !requiresExplicitFormat.value),
);

function clearScheduledFormat(): void {
  if (formatTimer !== undefined) {
    globalThis.clearTimeout(formatTimer);
    formatTimer = undefined;
  }
}

function resetFormatState(): void {
  formatState.status = 'idle';
  formatState.message = '';
  formatState.elapsedMs = 0;
}

function formatElapsedTime(elapsedMs: number): string {
  return elapsedMs < 1_000
    ? `${Math.max(0, Math.round(elapsedMs))} ms`
    : `${(elapsedMs / 1_000).toFixed(2)} s`;
}

async function runFormat(): Promise<void> {
  clearScheduledFormat();

  const source = rawYaml.value;
  if (source === '') {
    cleanYaml.value = 'null\n';
    resetFormatState();
    return;
  }

  const requestId = ++latestRequestId;
  const requestedIndentSize = indentSize.value;
  const requestedSortKeys = sortKeys.value;
  formatState.status = 'running';
  formatState.message = 'Formatting YAML…';
  formatState.elapsedMs = 0;

  try {
    const result = await workerClient.run({
      operation: 'format',
      source,
      indentSize: requestedIndentSize,
      sortKeys: requestedSortKeys,
    });

    if (
      requestId !== latestRequestId
      || rawYaml.value !== source
      || indentSize.value !== requestedIndentSize
      || sortKeys.value !== requestedSortKeys
    ) {
      return;
    }

    cleanYaml.value = result.value;
    formatState.status = 'success';
    formatState.elapsedMs = result.elapsedMs;
    formatState.message = `YAML formatted in ${formatElapsedTime(result.elapsedMs)}.`;
  }
  catch (error) {
    if (requestId !== latestRequestId) {
      return;
    }

    const taskError = toYamlTaskError(error);
    cleanYaml.value = '';
    formatState.elapsedMs = taskError.elapsedMs;
    formatState.message = taskError.message;
    formatState.status = taskError.code === 'cancelled'
      ? 'cancelled'
      : taskError.code === 'timeout'
        ? 'timeout'
        : 'error';
  }
}

function scheduleFormat(): void {
  clearScheduledFormat();
  ++latestRequestId;
  workerClient.cancel('YAML formatting cancelled because its input or settings changed.');

  if (rawYaml.value === '') {
    requiresExplicitFormat.value = false;
    cleanYaml.value = 'null\n';
    resetFormatState();
    return;
  }

  cleanYaml.value = '';
  requiresExplicitFormat.value = exceedsUtf8ByteLimit(rawYaml.value, YAML_LIVE_FORMAT_MAX_BYTES);
  formatState.elapsedMs = 0;
  formatState.status = 'pending';

  if (requiresExplicitFormat.value) {
    formatState.message = `Large YAML is formatted only on request. Select Format (maximum ${YAML_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes).`;
    return;
  }

  formatState.message = 'Waiting to format YAML…';
  formatTimer = globalThis.setTimeout(() => {
    formatTimer = undefined;
    runFormat();
  }, YAML_FORMAT_DEBOUNCE_MS);
}

function cancelFormat(): void {
  clearScheduledFormat();
  ++latestRequestId;
  workerClient.cancel('YAML formatting cancelled.');
  cleanYaml.value = '';
  formatState.status = 'cancelled';
  formatState.message = 'YAML formatting cancelled.';
  formatState.elapsedMs = 0;
}

watch([rawYaml, indentSize, sortKeys], scheduleFormat, { flush: 'post' });

onUnmounted(() => {
  clearScheduledFormat();
  ++latestRequestId;
  workerClient.dispose();
});
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <section aria-label="Formatting options">
      <c-card>
        <div grid grid-cols-1 gap-3 md:grid-cols-2>
          <CSwitch id="yaml-sort-keys" v-model:value="sortKeys" label="Sort keys" label-position="top" />
          <c-field label="Indent size (1–10)" label-for="yaml-indent-size">
            <CInputNumber
              id="yaml-indent-size"
              v-model:value="indentSize"
              test-id="yaml-indent-size"
              :min="1"
              :max="10"
            />
          </c-field>
        </div>
      </c-card>
    </section>

    <div class="c-tool-panel">
      <c-field
        label="Your raw YAML"
        :feedback="hasValidationError ? formatState.message : ''"
        :status="hasValidationError ? 'error' : 'default'"
      >
        <c-input-text
          ref="inputComponent"
          v-model:value="rawYaml"
          aria-label="Your raw YAML"
          placeholder="Paste your raw YAML here..."
          rows="20"
          multiline
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          monospace
        />
      </c-field>
      <div mb-4 flex flex-wrap items-center justify-end gap-2>
        <c-button
          type="primary"
          data-test-id="yaml-format-run"
          :disabled="formatState.status === 'running'"
          @click="runFormat"
        >
          {{ formatState.status === 'running' ? 'Formatting…' : 'Format' }}
        </c-button>
        <c-button
          v-if="canCancel"
          type="warning"
          data-test-id="yaml-format-cancel"
          @click="cancelFormat"
        >
          Cancel
        </c-button>
        <c-button :disabled="!cleanYaml" data-test-id="yaml-format-download" @click="downloadTextFile({ content: cleanYaml, filename: 'formatted.yaml' })">
          Download
        </c-button>
      </div>
      <p
        v-if="formatState.message"
        data-test-id="yaml-format-status"
        role="status"
        aria-live="polite"
        mb-0
        text-sm
        :class="{ 'status-error': hasValidationError }"
      >
        {{ formatState.message }}
      </p>
    </div>

    <c-field class="c-tool-panel" label="Prettified version of your YAML">
      <TextareaCopyable :value="cleanYaml" language="yaml" :follow-height-of="inputComponent?.inputWrapperRef" />
    </c-field>
  </div>
</template>

<style lang="less" scoped>
.result-card {
  position: relative;
  .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

.status-error {
  color: var(--n-feedback-text-color-error);
}
</style>
