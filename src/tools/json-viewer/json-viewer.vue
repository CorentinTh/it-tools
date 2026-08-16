<script setup lang="ts">
import { JsonWorkerClient } from './json-viewer.worker-client';
import {
  JSON_FORMAT_DEBOUNCE_MS,
  JSON_LIVE_FORMAT_MAX_BYTES,
  JSON_MAX_INPUT_BYTES,
  type JsonFormatMode,
  toJsonTaskError,
} from './json-viewer.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { downloadTextFile } from '@/composable/downloadText';
import { useResilientStorage } from '@/composable/use-resilient-storage';

const inputComponent = ref<{ inputWrapperRef?: HTMLElement }>();

const rawJson = ref('{"hello": "world", "foo": "bar"}');
const indentSize = useResilientStorage('json-prettify:indent-size', 3);
const sortKeys = useResilientStorage('json-prettify:sort-keys', true);
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
  <div class="c-tool-workbench c-tool-stack">
    <section aria-label="Formatting options">
      <c-card>
        <div grid grid-cols-1 gap-3 md:grid-cols-3>
          <c-select
            v-model:value="formatMode"
            data-test-id="json-format-mode"
            label="Parsing mode"
            :options="formatModeOptions"
          />
          <CSwitch id="json-sort-keys" v-model:value="sortKeys" label="Sort keys" label-position="top" />
          <c-field label="Indent size (0–10)" label-for="json-indent-size">
            <CInputNumber
              id="json-indent-size"
              v-model:value="indentSize"
              test-id="json-indent-size"
              :min="0"
              :max="10"
            />
          </c-field>
        </div>
      </c-card>
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
    </section>

    <div class="c-tool-panel">
      <c-field
        label="Your raw JSON"
        :feedback="hasValidationError ? formatState.message : ''"
        :status="hasValidationError ? 'error' : 'default'"
      >
        <c-input-text
          ref="inputComponent"
          v-model:value="rawJson"
          aria-label="Your raw JSON"
          placeholder="Paste your raw JSON here..."
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
        <c-button :disabled="!cleanJson" data-test-id="json-format-download" @click="downloadTextFile({ content: cleanJson, filename: 'formatted.json' })">
          Download
        </c-button>
      </div>
      <p
        v-if="formatState.message"
        data-test-id="json-format-status"
        role="status"
        aria-live="polite"
        mb-0
        text-sm
        :class="{ 'status-error': hasValidationError }"
      >
        {{ formatState.message }}
      </p>
    </div>

    <c-field class="c-tool-panel" label="Prettified version of your JSON">
      <TextareaCopyable :value="cleanJson" language="json" :follow-height-of="inputComponent?.inputWrapperRef" />
    </c-field>
  </div>
</template>

<style lang="less" scoped>
.status-error {
  color: var(--n-feedback-text-color-error);
}

.compatibility-warning {
  color: var(--n-warning-color);
}
</style>
