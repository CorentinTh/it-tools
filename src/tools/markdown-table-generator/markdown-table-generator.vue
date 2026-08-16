<script setup lang="ts">
import type { TableDelimiter } from './markdown-table-generator.service';
import { createMarkdownTableWorkerClient } from './markdown-table-generator.worker-client';
import { MARKDOWN_TABLE_MAX_INPUT_BYTES } from './markdown-table-generator.worker.protocol';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const source = ref('Name\tLanguage\tStars\nVue\tTypeScript\t5\nVite\tTypeScript\t5');
const delimiter = ref<TableDelimiter>('auto');
const firstRowHeader = ref(true);
const trimCells = ref(true);
const alignmentPattern = ref('left,left,right');
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const running = ref(false);
const completedSignature = ref('');
const client = createMarkdownTableWorkerClient();
const signature = computed(() => `${source.value}\0${delimiter.value}\0${firstRowHeader.value}\0${trimCells.value}\0${alignmentPattern.value}`);
const stale = computed(() => Boolean(output.value && completedSignature.value !== signature.value));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(source.value, MARKDOWN_TABLE_MAX_INPUT_BYTES));
const { copy } = useCopy({ source: output, text: 'Markdown table copied' });

async function generate() {
  if (!source.value.trim() || inputTooLarge.value || running.value) {
    return;
  }
  running.value = true;
  error.value = '';
  status.value = 'Generating locally…';
  const requestedSignature = signature.value;
  try {
    const result = await client.run({ source: source.value, delimiter: delimiter.value, firstRowHeader: firstRowHeader.value, trimCells: trimCells.value, alignmentPattern: alignmentPattern.value });
    output.value = result.value;
    completedSignature.value = requestedSignature;
    status.value = `Completed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    error.value = caught instanceof BoundedTextTaskError ? caught.message : 'Markdown table generation failed.';
    status.value = 'Generation failed.';
  }
  finally {
    running.value = false;
  }
}

function download() {
  downloadTextFile({ content: output.value, filename: 'table.md' });
}
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Bounded local table generation">
      CSV/TSV content stays in this browser. Generation runs only after an explicit action in a disposable worker, with 512 KiB input, 10,000-row, 128-column, 32 KiB-cell, and 1 MiB output limits.
    </c-alert>
    <c-card class="c-task-options" title="Table options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select v-model:value="delimiter" label="Input delimiter" :options="[{ label: 'Auto detect comma/tab', value: 'auto' }, { label: 'Comma (CSV)', value: 'comma' }, { label: 'Tab (TSV)', value: 'tab' }]" />
        <c-input-text v-model:value="alignmentPattern" label="Column alignments (comma-separated)" placeholder="left,center,right" :maxlength="1024" raw-text />
        <c-switch v-model:value="firstRowHeader" label="First row is the header" />
        <c-switch v-model:value="trimCells" label="Trim surrounding cell whitespace" />
      </div>
    </c-card>
    <c-input-text v-model:value="source" label="CSV or TSV input" test-id="markdown-table-input" raw-text monospace multiline :rows="16" />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="running || !source.trim() || inputTooLarge" data-test-id="markdown-table-generate" @click="generate">
        {{ running ? 'Generating…' : 'Generate Markdown table' }}
      </c-button>
      <c-button v-if="running" @click="client.cancel('Table generation was cancelled.')">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="inputTooLarge" title="Input too large">
      Table input is limited to 512 KiB of UTF-8 text.
    </c-alert>
    <c-alert v-if="error" title="Table generation error" data-test-id="markdown-table-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Output uses previous input">
      Generate again to apply the current source and options.
    </c-alert>
    <c-input-text :value="output" label="Markdown table" test-id="markdown-table-output" raw-text monospace multiline readonly :rows="16" />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button><c-button :disabled="!output" @click="download">
        Download
      </c-button>
    </div>
  </div>
</template>
