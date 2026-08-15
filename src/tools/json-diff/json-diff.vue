<script setup lang="ts">
import DiffsViewer from './diff-viewer/diff-viewer.vue';
import { JsonDiffWorkerClient } from './json-diff.worker-client';
import { type DiffReport } from './json-diff.types';
import { JSON_DIFF_MAX_INPUT_BYTES, toJsonDiffTaskError } from './json-diff.worker.protocol';
import CSwitch from '@/ui/c-switch/c-switch.vue';

const rawLeftJson = ref('');
const rawRightJson = ref('');
const alignArrays = ref(true);
const onlyShowDifferences = ref(false);
const report = shallowRef<DiffReport>();
const workerClient = new JsonDiffWorkerClient();

type CompareStatus = 'idle' | 'running' | 'success' | 'cancelled' | 'timeout' | 'error';

const compareState = reactive<{ message: string; status: CompareStatus }>({
  message: 'Enter both JSON documents, then select Compare.',
  status: 'idle',
});
let latestRequestId = 0;

const isRunning = computed(() => compareState.status === 'running');
const canCompare = computed(() => rawLeftJson.value.trim() !== '' && rawRightJson.value.trim() !== '' && !isRunning.value);
const hasError = computed(() => compareState.status === 'error' || compareState.status === 'timeout');

function formatElapsedTime(elapsedMs: number): string {
  return elapsedMs < 1_000 ? `${Math.round(elapsedMs)} ms` : `${(elapsedMs / 1_000).toFixed(2)} s`;
}

function alignmentMessage(result: DiffReport): string {
  const aligned = result.alignments.key + result.alignments.lcs;
  const fallback = result.alignments.index;
  if (aligned === 0 && fallback === 0) {
    return '';
  }
  return ` ${aligned} array${aligned === 1 ? '' : 's'} aligned by key/LCS; ${fallback} used positional fallback.`;
}

async function compare(): Promise<void> {
  const left = rawLeftJson.value;
  const right = rawRightJson.value;
  const requestedAlignArrays = alignArrays.value;
  const requestedOnlyDifferences = onlyShowDifferences.value;
  const requestId = ++latestRequestId;
  compareState.status = 'running';
  compareState.message = 'Comparing JSON documents…';

  try {
    const result = await workerClient.run({
      alignArrays: requestedAlignArrays,
      left,
      onlyShowDifferences: requestedOnlyDifferences,
      right,
    });
    if (requestId !== latestRequestId) {
      return;
    }
    report.value = result.value;
    compareState.status = 'success';
    compareState.message = `Compared ${result.value.inputNodeCount.toLocaleString('en')} input nodes in ${formatElapsedTime(result.elapsedMs)}.${alignmentMessage(result.value)}`;
  }
  catch (error) {
    if (requestId !== latestRequestId) {
      return;
    }
    const taskError = toJsonDiffTaskError(error, 'worker');
    compareState.status = taskError.code === 'timeout' ? 'timeout' : taskError.code === 'cancelled' ? 'cancelled' : 'error';
    compareState.message = taskError.message;
  }
}

function cancel(): void {
  ++latestRequestId;
  workerClient.cancel();
  compareState.status = 'cancelled';
  compareState.message = 'JSON comparison cancelled. The previous result remains available.';
}

watch([rawLeftJson, rawRightJson, alignArrays, onlyShowDifferences], () => {
  if (isRunning.value) {
    workerClient.cancel('JSON comparison cancelled because its input or options changed.');
  }
  ++latestRequestId;
  compareState.status = 'idle';
  compareState.message = report.value === undefined
    ? 'Enter both JSON documents, then select Compare.'
    : 'Inputs or options changed. Select Compare to refresh the result.';
});

onUnmounted(() => {
  ++latestRequestId;
  workerClient.dispose();
});
</script>

<template>
  <div class="c-tool-workbench c-diff-layout">
    <c-input-text
      v-model:value="rawLeftJson"
      label="Your first JSON"
      placeholder="Paste your first JSON here..."
      rows="20"
      test-id="leftJson"
      raw-text multiline monospace
    />

    <c-input-text
      v-model:value="rawRightJson"
      label="Your JSON to compare"
      placeholder="Paste your JSON to compare here..."
      rows="20"
      test-id="rightJson"
      raw-text multiline monospace
    />

    <section class="diff-controls" aria-label="Comparison options">
      <c-card>
        <div class="diff-options">
          <CSwitch
            id="json-diff-align-arrays"
            v-model:value="alignArrays"
            label="Align arrays by stable keys and bounded LCS"
            label-position="top"
          />
          <CSwitch
            id="json-diff-only-differences"
            v-model:value="onlyShowDifferences"
            label="Only show differences"
            label-position="top"
          />
        </div>
      </c-card>
      <div class="c-task-actions">
        <c-button
          type="primary"
          data-test-id="json-diff-run"
          :disabled="!canCompare"
          @click="compare"
        >
          {{ isRunning ? 'Comparing…' : 'Compare' }}
        </c-button>
        <c-button
          v-if="isRunning"
          type="warning"
          data-test-id="json-diff-cancel"
          @click="cancel"
        >
          Cancel
        </c-button>
      </div>
      <p
        data-test-id="json-diff-status"
        role="status"
        aria-live="polite"
        :class="{ 'status-error': hasError }"
      >
        {{ compareState.message }} Maximum {{ JSON_DIFF_MAX_INPUT_BYTES.toLocaleString('en') }} UTF-8 bytes per document.
      </p>
    </section>

    <DiffsViewer class="diff-result" :difference="report?.difference" />
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

.diff-controls {
  grid-column: 1 / -1;
}

.diff-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ui-space-3);
}

.status-error {
  color: var(--n-feedback-text-color-error);
}

@media (max-width: 800px) {
  .c-diff-layout {
    grid-template-columns: 1fr;
  }

  .diff-options {
    grid-template-columns: 1fr;
  }
}
</style>
