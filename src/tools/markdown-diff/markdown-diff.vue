<script setup lang="ts">
import MarkdownDiffPreview from './markdown-diff-preview.vue';
import { type MarkdownDiffGranularity, type MarkdownDiffTask, isMarkdownDiffTaskStale } from './markdown-diff.service';
import { MARKDOWN_DIFF_PREVIEW_MAX_BYTES } from './markdown-diff-preview.service';
import { createMarkdownDiffWorkerClient } from './markdown-diff.worker-client';
import { MARKDOWN_DIFF_MAX_SIDE_BYTES } from './markdown-diff.worker.protocol';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';
import { exceedsUtf8ByteLimit, truncateUtf8ToByteLimit } from '@/utils/utf8';

const left = ref('# Release notes\n\n- Added local processing\n- Fixed stale output');
const right = ref('# Release notes\n\n- Added **bounded** local processing\n- Fixed stale output\n- Added privacy checks');
const granularity = ref<MarkdownDiffGranularity>('line');
const previewEnabled = ref(true);
const output = ref('');
const previewLeft = ref('');
const previewRight = ref('');
const completedTask = ref<MarkdownDiffTask | null>(null);
const status = ref('Ready. Markdown stays in this tab.');
const error = ref('');
const running = ref(false);
const client = createMarkdownDiffWorkerClient();
let operationId = 0;

const stale = computed(() => Boolean(output.value && isMarkdownDiffTaskStale(completedTask.value, {
  left: left.value,
  right: right.value,
  granularity: granularity.value,
})));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(left.value, MARKDOWN_DIFF_MAX_SIDE_BYTES)
  || exceedsUtf8ByteLimit(right.value, MARKDOWN_DIFF_MAX_SIDE_BYTES));
const canCompare = computed(() => !running.value && !inputTooLarge.value && Boolean(left.value || right.value));
const leftPreviewTruncated = computed(() => exceedsUtf8ByteLimit(previewLeft.value, MARKDOWN_DIFF_PREVIEW_MAX_BYTES));
const rightPreviewTruncated = computed(() => exceedsUtf8ByteLimit(previewRight.value, MARKDOWN_DIFF_PREVIEW_MAX_BYTES));
const boundedLeftPreview = computed(() => truncateUtf8ToByteLimit(previewLeft.value, MARKDOWN_DIFF_PREVIEW_MAX_BYTES));
const boundedRightPreview = computed(() => truncateUtf8ToByteLimit(previewRight.value, MARKDOWN_DIFF_PREVIEW_MAX_BYTES));
const { copy } = useCopy({ source: output, text: 'Markdown diff report copied' });

watch([left, right, granularity], () => {
  if (!running.value) {
    return;
  }
  operationId += 1;
  client.cancel('Markdown diff was cancelled because an input changed.');
  running.value = false;
  status.value = 'Input changed; the previous worker was terminated.';
});

async function compare() {
  if (!canCompare.value) {
    return;
  }
  const currentOperation = ++operationId;
  const requestedLeft = left.value;
  const requestedRight = right.value;
  const requestedGranularity = granularity.value;
  running.value = true;
  error.value = '';
  status.value = 'Comparing Markdown locally in a disposable worker…';
  try {
    const result = await client.run({ left: requestedLeft, right: requestedRight, granularity: requestedGranularity });
    if (currentOperation !== operationId) {
      return;
    }
    output.value = result.value;
    previewLeft.value = requestedLeft;
    previewRight.value = requestedRight;
    completedTask.value = { left: requestedLeft, right: requestedRight, granularity: requestedGranularity };
    status.value = `Completed locally in ${Math.round(result.elapsedMs).toLocaleString('en-US')} ms; the worker was terminated.`;
  }
  catch (caught) {
    if (currentOperation !== operationId) {
      return;
    }
    error.value = caught instanceof Error ? caught.message : 'Markdown comparison failed.';
    status.value = 'Comparison failed.';
  }
  finally {
    if (currentOperation === operationId) {
      running.value = false;
    }
  }
}

function cancel() {
  operationId += 1;
  client.cancel('Markdown comparison was cancelled.');
  running.value = false;
  status.value = 'Comparison cancelled; the worker was terminated.';
}

function clearAll() {
  operationId += 1;
  client.cancel('Markdown comparison was cancelled while clearing values.');
  left.value = '';
  right.value = '';
  output.value = '';
  previewLeft.value = '';
  previewRight.value = '';
  completedTask.value = null;
  error.value = '';
  running.value = false;
  status.value = 'Markdown inputs and result cleared.';
}

onBeforeUnmount(() => {
  operationId += 1;
  client.dispose();
  left.value = '';
  right.value = '';
  output.value = '';
  previewLeft.value = '';
  previewRight.value = '';
  completedTask.value = null;
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local bounded Markdown diff">
      Comparison runs only after an explicit action in a disposable worker. Each side is limited to 256 KiB; alignment is capped at 1,000,000 cells. Preview renders at most 64 KiB per side, disables raw HTML and active links/images, and applies a strict HTML-only sanitizer allow-list.
    </c-alert>

    <c-card class="c-task-options" title="Comparison options">
      <div grid grid-cols-1 items-start gap-3 md:grid-cols-2>
        <c-select
          v-model:value="granularity"
          label="Source diff granularity"
          :options="[
            { label: 'Line — unified Markdown source', value: 'line' },
            { label: 'Word/token — exact JSON fragments', value: 'word' },
          ]"
        />
        <c-switch
          v-model:value="previewEnabled"
          label="Show sanitized rendered previews"
          description="Uses the last completed input snapshot; links and images are text-only."
        />
      </div>
    </c-card>

    <div class="markdown-diff-inputs">
      <c-input-text v-model:value="left" label="Original Markdown" test-id="markdown-diff-left" raw-text monospace multiline :rows="18" />
      <c-input-text v-model:value="right" label="Modified Markdown" test-id="markdown-diff-right" raw-text monospace multiline :rows="18" />
    </div>

    <div class="c-task-actions">
      <c-button type="primary" :disabled="!canCompare" data-test-id="markdown-diff-run" @click="compare">
        {{ running ? 'Comparing…' : 'Compare Markdown' }}
      </c-button>
      <c-button v-if="running" data-test-id="markdown-diff-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button :disabled="running && !output" @click="clearAll">
        Clear
      </c-button>
    </div>

    <p class="c-task-status" role="status" aria-live="polite" data-test-id="markdown-diff-status">
      {{ status }}
    </p>
    <c-alert v-if="inputTooLarge" title="Input too large">
      Each Markdown document is limited to 256 KiB of UTF-8 text.
    </c-alert>
    <c-alert v-if="error" title="Markdown diff error" data-test-id="markdown-diff-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Result uses previous input">
      Compare again to apply the current Markdown and granularity.
    </c-alert>

    <c-input-text :value="output" label="Markdown source diff report" test-id="markdown-diff-output" raw-text monospace multiline readonly :rows="20" />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="downloadTextFile({ content: output, filename: 'markdown-diff.txt' })">
        Download
      </c-button>
    </div>

    <section v-if="previewEnabled && output" aria-label="Sanitized rendered previews">
      <h2 mb-3 text-lg font-600>
        Sanitized rendered previews
      </h2>
      <p v-if="leftPreviewTruncated || rightPreviewTruncated" mb-3 text-sm op-70 role="status">
        Preview is limited to the first 64 KiB per side; the source diff still uses the complete bounded inputs.
      </p>
      <div class="markdown-diff-previews">
        <c-card title="Original preview" data-test-id="markdown-diff-left-preview">
          <MarkdownDiffPreview :source="boundedLeftPreview" />
        </c-card>
        <c-card title="Modified preview" data-test-id="markdown-diff-right-preview">
          <MarkdownDiffPreview :source="boundedRightPreview" />
        </c-card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.markdown-diff-inputs,
.markdown-diff-previews {
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--ui-space-4);
}

@media (min-width: 900px) {
  .markdown-diff-inputs,
  .markdown-diff-previews {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
