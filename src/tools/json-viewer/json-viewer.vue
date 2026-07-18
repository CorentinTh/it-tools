<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { JsonWorkerClient } from './json-viewer.worker-client';
import {
  JSON_FORMAT_DEBOUNCE_MS,
  JSON_LIVE_FORMAT_MAX_BYTES,
  JSON_MAX_INPUT_BYTES,
  type JsonFormatMode,
  toJsonTaskError,
} from './json-viewer.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

const inputComponent = ref<{ inputWrapperRef?: HTMLElement }>();

const rawJson = ref('{"hello": "world", "foo": "bar"}');
const indentSize = useStorage('json-prettify:indent-size', 3);
const sortKeys = useStorage('json-prettify:sort-keys', true);
const formatMode = ref<JsonFormatMode>('strict');
const cleanJson = shallowRef('');
const requiresExplicitFormat = ref(false);
const workerClient = new JsonWorkerClient();

const formatModeOptions: Array<{ label: string; value: JsonFormatMode }> = [
  { label: 'Strict JSON (lossless)', value: 'strict' },
  { label: 'JSON5 compatibility', value: 'json5' },
];

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

  const source = rawJson.value;
  if (source === '') {
    cleanJson.value = '';
    resetFormatState();
    return;
  }

  const requestId = ++latestRequestId;
  const requestedIndentSize = indentSize.value;
  const requestedSortKeys = sortKeys.value;
  const requestedMode = formatMode.value;
  formatState.status = 'running';
  formatState.message = 'Formatting JSON…';
  formatState.elapsedMs = 0;

  try {
    const result = await workerClient.run({
      operation: 'format',
      source,
      indentSize: requestedIndentSize,
      sortKeys: requestedSortKeys,
      mode: requestedMode,
    });

    if (
      requestId !== latestRequestId
      || rawJson.value !== source
      || indentSize.value !== requestedIndentSize
      || sortKeys.value !== requestedSortKeys
      || formatMode.value !== requestedMode
    ) {
      return;
    }

    cleanJson.value = result.value;
    formatState.status = 'success';
    formatState.elapsedMs = result.elapsedMs;
    formatState.message = `JSON formatted in ${formatElapsedTime(result.elapsedMs)}.`;
  }
  catch (error) {
    if (requestId !== latestRequestId) {
      return;
    }

    const taskError = toJsonTaskError(error);
    cleanJson.value = '';
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
  workerClient.cancel('JSON formatting cancelled because its input or settings changed.');

  if (rawJson.value === '') {
    requiresExplicitFormat.value = false;
    cleanJson.value = '';
    resetFormatState();
    return;
  }

  cleanJson.value = '';
  requiresExplicitFormat.value = exceedsUtf8ByteLimit(rawJson.value, JSON_LIVE_FORMAT_MAX_BYTES);
  formatState.elapsedMs = 0;
  formatState.status = 'pending';

  if (requiresExplicitFormat.value) {
    formatState.message = `Large JSON is formatted only on request. Select Format (maximum ${JSON_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes).`;
    return;
  }

  formatState.message = 'Waiting to format JSON…';
  formatTimer = globalThis.setTimeout(() => {
    formatTimer = undefined;
    runFormat();
  }, JSON_FORMAT_DEBOUNCE_MS);
}

function cancelFormat(): void {
  clearScheduledFormat();
  ++latestRequestId;
  workerClient.cancel('JSON formatting cancelled.');
  cleanJson.value = '';
  formatState.status = 'cancelled';
  formatState.message = 'JSON formatting cancelled.';
  formatState.elapsedMs = 0;
}

watch([rawJson, indentSize, sortKeys, formatMode], scheduleFormat, { flush: 'post', immediate: true });

onUnmounted(() => {
  clearScheduledFormat();
  ++latestRequestId;
  workerClient.dispose();
});
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 760px" flex flex-wrap justify-center gap-3>
      <c-select
        v-model:value="formatMode"
        data-test-id="json-format-mode"
        label="Parsing mode:"
        :options="formatModeOptions"
        style="min-width: 240px"
      />
      <n-form-item label="Sort keys :" label-placement="left" label-width="100">
        <n-switch v-model:value="sortKeys" />
      </n-form-item>
      <n-form-item label="Indent size :" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="0" max="10" style="width: 100px" />
      </n-form-item>
    </div>
    <p
      v-if="formatMode === 'json5'"
      data-test-id="json-compatibility-warning"
      role="alert"
      mt-0
      text-center
      text-sm
      class="compatibility-warning"
    >
      JSON5 compatibility rejects unsafe integers and non-finite numbers. Decimal and exponent values use JavaScript number semantics and may lose precision.
    </p>
  </div>

  <n-form-item
    label="Your raw JSON"
    :feedback="hasValidationError ? formatState.message : ''"
    :validation-status="hasValidationError ? 'error' : undefined"
  >
    <c-input-text
      ref="inputComponent"
      v-model:value="rawJson"
      placeholder="Paste your raw JSON here..."
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
      data-test-id="json-format-run"
      :disabled="formatState.status === 'running'"
      @click="runFormat"
    >
      {{ formatState.status === 'running' ? 'Formatting…' : 'Format' }}
    </c-button>
    <c-button
      v-if="canCancel"
      type="warning"
      data-test-id="json-format-cancel"
      @click="cancelFormat"
    >
      Cancel
    </c-button>
  </div>
  <p
    v-if="formatState.message"
    data-test-id="json-format-status"
    role="status"
    aria-live="polite"
    mb-4
    text-sm
    :class="{ 'status-error': hasValidationError }"
  >
    {{ formatState.message }}
  </p>
  <n-form-item label="Prettified version of your JSON">
    <TextareaCopyable :value="cleanJson" language="json" :follow-height-of="inputComponent?.inputWrapperRef" />
  </n-form-item>
</template>

<style lang="less" scoped>
.status-error {
  color: var(--n-feedback-text-color-error);
}

.compatibility-warning {
  color: var(--n-warning-color);
}
</style>
