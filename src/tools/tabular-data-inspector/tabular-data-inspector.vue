<script setup lang="ts">
import type { TableDelimiter } from '../markdown-table-generator/markdown-table-generator.service';
import type { EmptyCellMode, TabularOutputFormat } from './tabular-data-inspector.service';
import { createTabularDataWorkerClient } from './tabular-data-inspector.worker-client';
import { TABULAR_MAX_INPUT_BYTES } from './tabular-data-inspector.worker.protocol';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const source = ref('name,count,active,code\nalpha,12,true,001\nbeta,,false,002');
const delimiter = ref<TableDelimiter>('auto');
const firstRowHeader = ref(true);
const trimCells = ref(false);
const outputFormat = ref<TabularOutputFormat>('inspect');
const emptyCellMode = ref<EmptyCellMode>('empty-string');
const protectSpreadsheetFormulas = ref(true);
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const running = ref(false);
const selectedFileName = ref('');
const completedSignature = ref('');
const client = createTabularDataWorkerClient();
let fileSelection = 0;

const signature = computed(() => [source.value, delimiter.value, firstRowHeader.value, trimCells.value, outputFormat.value, emptyCellMode.value, protectSpreadsheetFormulas.value].join('\0'));
const stale = computed(() => Boolean(output.value && completedSignature.value !== signature.value));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(source.value, TABULAR_MAX_INPUT_BYTES));
const fileExtension = computed(() => outputFormat.value === 'csv' ? 'csv' : outputFormat.value === 'tsv' ? 'tsv' : outputFormat.value.startsWith('json') ? 'json' : 'txt');
const outputLabel = computed(() => outputFormat.value === 'inspect' ? 'Bounded inspection report' : outputFormat.value.startsWith('json') ? 'JSON rows' : `Normalized ${outputFormat.value.toUpperCase()}`);
const { copy } = useCopy({ source: output, text: 'Tabular result copied' });

async function selectFile(file: File) {
  const selection = ++fileSelection;
  error.value = '';
  selectedFileName.value = file.name;
  if (file.size > TABULAR_MAX_INPUT_BYTES) {
    source.value = '';
    error.value = 'The selected file exceeds the 1 MiB input limit.';
    status.value = 'File rejected before reading.';
    return;
  }
  try {
    const buffer = await file.arrayBuffer();
    if (selection !== fileSelection) {
      return;
    }
    source.value = new TextDecoder('utf-8', { fatal: true }).decode(buffer).replace(/^\uFEFF/u, '');
    status.value = 'Local UTF-8 file loaded. Choose Process table.';
  }
  catch {
    if (selection === fileSelection) {
      source.value = '';
      error.value = 'The selected file is not valid UTF-8 text.';
      status.value = 'File decoding failed.';
    }
  }
}

async function processTable() {
  if (!source.value.trim() || inputTooLarge.value || running.value) {
    return;
  }
  running.value = true;
  error.value = '';
  status.value = 'Processing locally in a disposable worker…';
  const requestedSignature = signature.value;
  try {
    const result = await client.run({
      source: source.value,
      delimiter: delimiter.value,
      firstRowHeader: firstRowHeader.value,
      trimCells: trimCells.value,
      outputFormat: outputFormat.value,
      emptyCellMode: emptyCellMode.value,
      protectSpreadsheetFormulas: protectSpreadsheetFormulas.value,
    });
    output.value = result.value;
    completedSignature.value = requestedSignature;
    status.value = `Completed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    error.value = caught instanceof BoundedTextTaskError ? caught.message : 'Tabular processing failed.';
    status.value = 'Processing failed.';
  }
  finally {
    running.value = false;
  }
}

function download() {
  downloadTextFile({ content: output.value, filename: `tabular-result.${fileExtension.value}` });
}

onBeforeUnmount(() => {
  fileSelection += 1;
  source.value = '';
  output.value = '';
  client.dispose();
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local bounded CSV/TSV processing">
      Pasted text and selected files stay in this page. One explicit worker parse handles RFC 4180-style quoted commas, doubled quotes, embedded newlines, tabs, and empty cells under 1 MiB input, 10,000-row, 128-column, 200,000-cell, 32 KiB-cell, 2 MiB output, and eight-second limits. XLSX is deliberately not bundled.
    </c-alert>
    <c-card title="Optional local file">
      <c-file-upload accept=".csv,.tsv,text/csv,text/tab-separated-values,text/plain" title="Drop one UTF-8 CSV/TSV file here, or select it (maximum 1 MiB)" data-test-id="tabular-file" @file-upload="selectFile" />
      <p v-if="selectedFileName" mt-2>
        Selected: <bdi>{{ selectedFileName }}</bdi>
      </p>
    </c-card>
    <c-card class="c-task-options" title="Parse and output options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select v-model:value="delimiter" label="Input delimiter" :options="[{ label: 'Auto detect comma/tab', value: 'auto' }, { label: 'Comma (CSV)', value: 'comma' }, { label: 'Tab (TSV)', value: 'tab' }]" />
        <c-select v-model:value="outputFormat" label="Output" :options="[{ label: 'Inspect dimensions, types, and preview', value: 'inspect' }, { label: 'JSON — preserve every cell as text', value: 'json-strings' }, { label: 'JSON — conservative primitive inference', value: 'json-inferred' }, { label: 'Normalized CSV', value: 'csv' }, { label: 'Normalized TSV', value: 'tsv' }]" />
        <c-switch v-model:value="firstRowHeader" label="First row contains column names" />
        <c-switch v-model:value="trimCells" label="Trim surrounding cell whitespace" />
        <c-select v-if="outputFormat === 'json-inferred'" v-model:value="emptyCellMode" label="Inferred JSON empty cells" :options="[{ label: 'Preserve as empty string', value: 'empty-string' }, { label: 'Convert to null', value: 'null' }]" />
        <c-switch v-if="outputFormat === 'csv' || outputFormat === 'tsv'" v-model:value="protectSpreadsheetFormulas" label="Prefix formula-like cells with apostrophe" />
      </div>
      <p mt-3 op-75>
        Text mode never infers types. Inference recognizes only lowercase true/false and finite JSON-like numbers; leading-zero identifiers and unsafe integers stay strings. Formula protection intentionally changes exported CSV/TSV cells beginning with =, +, -, or @.
      </p>
    </c-card>
    <c-input-text v-model:value="source" label="CSV or TSV input" test-id="tabular-input" raw-text monospace multiline :rows="16" />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="running || !source.trim() || inputTooLarge" data-test-id="tabular-process" @click="processTable">
        {{ running ? 'Processing…' : 'Process table' }}
      </c-button>
      <c-button v-if="running" @click="client.cancel('Tabular processing was cancelled.')">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="inputTooLarge" title="Input too large">
      Input is limited to 1 MiB of UTF-8 text.
    </c-alert>
    <c-alert v-if="error" title="Tabular processing error" data-test-id="tabular-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Output uses previous input">
      Process again to apply the current source and options.
    </c-alert>
    <c-input-text :value="output" :label="outputLabel" test-id="tabular-output" raw-text monospace multiline readonly :rows="18" />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="download">
        Download
      </c-button>
    </div>
  </div>
</template>
