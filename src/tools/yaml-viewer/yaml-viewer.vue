<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { YamlWorkerClient } from './yaml-viewer.worker-client';
import {
  YAML_FORMAT_DEBOUNCE_MS,
  YAML_LIVE_FORMAT_MAX_BYTES,
  YAML_MAX_INPUT_BYTES,
  toYamlTaskError,
} from './yaml-viewer.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

const inputComponent = ref<{ inputWrapperRef?: HTMLElement }>();

const rawYaml = ref('');
const indentSize = useStorage('yaml-prettify:indent-size', 2);
const sortKeys = useStorage('yaml-prettify:sort-keys', false);
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
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px" flex justify-center gap-3>
      <n-form-item label="Sort keys :" label-placement="left" label-width="100">
        <n-switch v-model:value="sortKeys" />
      </n-form-item>
      <n-form-item label="Indent size :" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="1" max="10" style="width: 100px" />
      </n-form-item>
    </div>
  </div>

  <n-form-item
    label="Your raw YAML"
    :feedback="hasValidationError ? formatState.message : ''"
    :validation-status="hasValidationError ? 'error' : undefined"
  >
    <c-input-text
      ref="inputComponent"
      v-model:value="rawYaml"
      placeholder="Paste your raw YAML here..."
      rows="20"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
    />
  </n-form-item>
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
  </div>
  <p
    v-if="formatState.message"
    data-test-id="yaml-format-status"
    role="status"
    aria-live="polite"
    mb-4
    text-sm
    :class="{ 'status-error': hasValidationError }"
  >
    {{ formatState.message }}
  </p>
  <n-form-item label="Prettified version of your YAML">
    <TextareaCopyable :value="cleanYaml" language="yaml" :follow-height-of="inputComponent?.inputWrapperRef" />
  </n-form-item>
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
