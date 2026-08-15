<script setup lang="ts">
import type { TextStatistics } from './text-statistics.service';
import { TextStatisticsWorkerClient } from './text-statistics.worker-client';
import { TEXT_STATISTICS_LIVE_MAX_BYTES, TEXT_STATISTICS_MAX_INPUT_BYTES } from './text-statistics.worker.protocol';
import { formatBytes } from '@/utils/convert';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';

const text = ref('');
const emptyStatistics: TextStatistics = { byteSize: 0, characterCount: 0, lineCount: 0, wordCount: 0 };
const statistics = shallowRef<TextStatistics>(emptyStatistics);
const client = new TextStatisticsWorkerClient();
const state = reactive<{ message: string; status: 'idle' | 'pending' | 'running' | 'success' | 'cancelled' | 'timeout' | 'error' }>({ message: '', status: 'idle' });
let timer: ReturnType<typeof globalThis.setTimeout> | undefined;
let requestId = 0;

const isRunning = computed(() => state.status === 'running');
const hasError = computed(() => state.status === 'error' || state.status === 'timeout');

function clearTimer(): void {
  if (timer !== undefined) {
    globalThis.clearTimeout(timer);
    timer = undefined;
  }
}

async function analyze(): Promise<void> {
  clearTimer();
  if (text.value === '') {
    statistics.value = emptyStatistics;
    state.status = 'idle';
    state.message = '';
    return;
  }
  const source = text.value;
  const currentRequest = ++requestId;
  state.status = 'running';
  state.message = 'Analyzing text…';
  try {
    const result = await client.run({ source });
    if (currentRequest !== requestId) {
      return;
    }
    statistics.value = result.value;
    state.status = 'success';
    state.message = `Text analyzed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (error) {
    if (currentRequest !== requestId) {
      return;
    }
    const taskError = error instanceof BoundedTextTaskError ? error : new BoundedTextTaskError('processing', 'Text statistics could not be computed.');
    state.status = taskError.code === 'timeout' ? 'timeout' : taskError.code === 'cancelled' ? 'cancelled' : 'error';
    state.message = taskError.message;
  }
}

watch(text, () => {
  clearTimer();
  ++requestId;
  client.cancel('Text analysis cancelled because its input changed.');
  if (text.value === '') {
    statistics.value = emptyStatistics;
    state.status = 'idle';
    state.message = '';
  }
  // Keep input-event work bounded. Exact UTF-8 validation still happens in
  // the worker when a large task is explicitly started.
  else if (text.value.length > TEXT_STATISTICS_MAX_INPUT_BYTES) {
    state.status = 'error';
    state.message = `Text analysis is limited to ${TEXT_STATISTICS_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`;
  }
  else if (exceedsUtf8ByteLimit(text.value, TEXT_STATISTICS_LIVE_MAX_BYTES)) {
    state.status = 'pending';
    state.message = 'Large text is analyzed only on request. Select Analyze text.';
  }
  else {
    state.status = 'pending';
    state.message = 'Waiting to analyze text…';
    timer = globalThis.setTimeout(analyze, 150);
  }
}, { flush: 'post' });

function cancel(): void {
  clearTimer();
  ++requestId;
  client.cancel();
  state.status = 'cancelled';
  state.message = 'Text analysis cancelled. The previous statistics remain available.';
}

onUnmounted(() => {
  clearTimer();
  ++requestId;
  client.dispose();
});
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card title="Input">
      <c-input-text v-model:value="text" label="Text to analyze" placeholder="Your text..." rows="8" raw-text multiline />
    </c-card>

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="text-statistics-run" :disabled="text === '' || isRunning" @click="analyze">
        {{ isRunning ? 'Analyzing…' : 'Analyze text' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="text-statistics-cancel" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p
      v-if="state.message"
      data-test-id="text-statistics-status"
      role="status"
      aria-live="polite"
      :class="{ 'status-error': hasError }"
    >
      {{ state.message }}
    </p>

    <c-card title="Statistics">
      <dl class="statistics-grid">
        <div
          v-for="item in [
            { label: 'Character count', value: statistics.characterCount },
            { label: 'Word count', value: statistics.wordCount },
            { label: 'Line count', value: statistics.lineCount },
            { label: 'Byte size', value: formatBytes(statistics.byteSize) },
          ]" :key="item.label" class="statistic"
        >
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>
    </c-card>
  </div>
</template>

<style scoped>
.statistics-grid {
  display: grid;
  margin: 0;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
  gap: var(--ui-space-3);
}

.statistic {
  padding: var(--ui-space-3);
  text-align: center;
}

.statistic dt {
  opacity: 0.7;
}

.statistic dd {
  margin: var(--ui-space-1) 0 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.status-error {
  color: var(--n-feedback-text-color-error);
}
</style>
