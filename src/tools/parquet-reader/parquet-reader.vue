<script setup lang="ts">
import { ParquetReaderWorkerClient } from './parquet-reader.worker-client';
import {
  PARQUET_MAX_FILE_BYTES,
  PARQUET_MAX_FILE_LABEL,
  PARQUET_MAX_PREVIEW_ROWS,
  PARQUET_MAX_SELECTED_COLUMNS,
  PARQUET_SUPPORTED_CODECS,
  type ParquetInspectionResult,
  type ParquetPreviewResult,
  ParquetReaderTaskError,
} from './parquet-reader.types';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';
import { formatBytes } from '@/utils/convert';

const client = new ParquetReaderWorkerClient();
const selectedFile = shallowRef<File>();
const inspection = shallowRef<ParquetInspectionResult>();
const preview = shallowRef<ParquetPreviewResult>();
const selectedColumns = ref<string[]>([]);
const rowStart = ref(0);
const rowCount = ref(50);
const running = ref(false);
const error = ref('');
const status = ref('Select a local .parquet file. Nothing is read until you choose Inspect metadata.');
const completedPreviewSignature = ref('');
let operation = 0;

const supportedCodecs = new Set<string>(PARQUET_SUPPORTED_CODECS);
const fileAccepted = computed(() => Boolean(selectedFile.value && selectedFile.value.size > 0 && selectedFile.value.size <= PARQUET_MAX_FILE_BYTES));
const selectedColumnSummaries = computed(() => inspection.value?.columns.filter(column => selectedColumns.value.includes(column.name)) ?? []);
const unsupportedSelectedCodecs = computed(() => [...new Set(selectedColumnSummaries.value.flatMap(column => column.codecs).filter(codec => !supportedCodecs.has(codec)))].sort());
const canPreview = computed(() => Boolean(
  selectedFile.value
  && inspection.value
  && !running.value
  && selectedColumns.value.length > 0
  && selectedColumns.value.length <= PARQUET_MAX_SELECTED_COLUMNS
  && unsupportedSelectedCodecs.value.length === 0
  && rowStart.value >= 0
  && rowStart.value < inspection.value.numRows,
));
const previewSignature = computed(() => [selectedFile.value?.name, selectedFile.value?.size, selectedColumns.value.join('\0'), rowStart.value, rowCount.value].join('\0'));
const previewStale = computed(() => Boolean(preview.value && completedPreviewSignature.value !== previewSignature.value));
const visibleSchema = computed(() => inspection.value?.schema.slice(0, 200) ?? []);
const { copy } = useCopy({ createToast: true });

function resetResults(): void {
  inspection.value = undefined;
  preview.value = undefined;
  selectedColumns.value = [];
  rowStart.value = 0;
  completedPreviewSignature.value = '';
}

function selectFile(file: File): void {
  operation += 1;
  client.cancel('Parquet processing was cancelled because a different file was selected.');
  selectedFile.value = file;
  resetResults();
  error.value = '';
  status.value = file.size > 0 && file.size <= PARQUET_MAX_FILE_BYTES
    ? 'File selected. Choose Inspect metadata to read its bounded footer locally.'
    : file.size === 0
      ? 'Empty files cannot be inspected.'
      : `The selected file exceeds the ${PARQUET_MAX_FILE_LABEL} limit.`;
}

async function inspect(): Promise<void> {
  const file = selectedFile.value;
  if (!file || !fileAccepted.value || running.value) {
    return;
  }
  const current = ++operation;
  running.value = true;
  error.value = '';
  preview.value = undefined;
  status.value = 'Reading bounded Parquet metadata in a disposable worker…';
  try {
    const task = await client.run({ kind: 'inspect', file });
    if (current !== operation || file !== selectedFile.value || task.value.kind !== 'inspection') {
      return;
    }
    inspection.value = task.value;
    selectedColumns.value = task.value.columns.slice(0, PARQUET_MAX_SELECTED_COLUMNS).map(column => column.name);
    rowStart.value = 0;
    status.value = `Metadata inspected in ${Math.round(task.elapsedMs)} ms. Select up to ${PARQUET_MAX_SELECTED_COLUMNS} columns and load one bounded page.`;
  }
  catch (caught) {
    if (current !== operation) {
      return;
    }
    error.value = caught instanceof ParquetReaderTaskError ? caught.message : 'Parquet metadata inspection failed.';
    status.value = caught instanceof ParquetReaderTaskError && caught.code === 'cancelled' ? 'Metadata inspection was cancelled.' : 'Metadata inspection failed.';
  }
  finally {
    if (current === operation) {
      running.value = false;
    }
  }
}

function updateColumn(name: string, checked: boolean): void {
  preview.value = undefined;
  completedPreviewSignature.value = '';
  if (!checked) {
    selectedColumns.value = selectedColumns.value.filter(column => column !== name);
    return;
  }
  if (selectedColumns.value.length >= PARQUET_MAX_SELECTED_COLUMNS) {
    error.value = `Select at most ${PARQUET_MAX_SELECTED_COLUMNS} columns per preview.`;
    return;
  }
  selectedColumns.value = [...selectedColumns.value, name];
  error.value = '';
}

function selectFirstColumns(): void {
  selectedColumns.value = inspection.value?.columns.slice(0, PARQUET_MAX_SELECTED_COLUMNS).map(column => column.name) ?? [];
}

async function loadPreview(): Promise<void> {
  const file = selectedFile.value;
  if (!file || !canPreview.value) {
    return;
  }
  const current = ++operation;
  const signature = previewSignature.value;
  running.value = true;
  error.value = '';
  status.value = 'Decoding only the selected row page and columns in a disposable worker…';
  try {
    const task = await client.run({ kind: 'preview', file, columns: [...selectedColumns.value], rowStart: rowStart.value, rowCount: rowCount.value });
    if (current !== operation || file !== selectedFile.value || task.value.kind !== 'preview') {
      return;
    }
    preview.value = task.value;
    completedPreviewSignature.value = signature;
    status.value = `Rows ${task.value.rowStart.toLocaleString('en-US')}–${Math.max(task.value.rowStart, task.value.rowEnd - 1).toLocaleString('en-US')} decoded in ${Math.round(task.elapsedMs)} ms.`;
  }
  catch (caught) {
    if (current !== operation) {
      return;
    }
    error.value = caught instanceof ParquetReaderTaskError ? caught.message : 'Parquet preview failed.';
    status.value = caught instanceof ParquetReaderTaskError && caught.code === 'cancelled' ? 'Preview was cancelled.' : 'Preview failed.';
  }
  finally {
    if (current === operation) {
      running.value = false;
    }
  }
}

function cancel(): void {
  if (!running.value) {
    return;
  }
  operation += 1;
  client.cancel();
  running.value = false;
  status.value = 'Parquet processing was cancelled; its disposable worker was terminated.';
}

function clear(): void {
  operation += 1;
  client.cancel('Parquet processing was cancelled because the tool was cleared.');
  selectedFile.value = undefined;
  resetResults();
  error.value = '';
  running.value = false;
  status.value = 'File, metadata, preview, and exports were cleared from this page.';
}

onBeforeUnmount(() => {
  operation += 1;
  selectedFile.value = undefined;
  inspection.value = undefined;
  preview.value = undefined;
  client.dispose();
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local, bounded Parquet inspection">
      Files stay in this page and are never uploaded or persisted. An explicit disposable worker reads a validated footer, then only the selected page and at most {{ PARQUET_MAX_SELECTED_COLUMNS }} columns. Files are capped at {{ PARQUET_MAX_FILE_LABEL }}; footer, schema, row-group, chunk, nested-value, cell, preview, export, and 15-second limits apply independently.
    </c-alert>
    <c-alert title="Supported surface">
      This first reader supports standard uncompressed and Snappy Parquet columns. GZip, Brotli, LZO, LZ4, and ZSTD columns remain metadata-visible but cannot be previewed. Encrypted files and external column-file layouts are rejected. Unannotated byte arrays are exported as hex; logical JSON stays text; 64-bit integers and timestamps use exact strings. CSV export prefixes formula-like cells with an apostrophe.
    </c-alert>

    <c-card class="c-task-options" title="Local Parquet file">
      <c-file-upload
        data-test-id="parquet-upload"
        accept=".parquet,application/vnd.apache.parquet,application/octet-stream"
        :title="`Drop one .parquet file here, or select it (maximum ${PARQUET_MAX_FILE_LABEL})`"
        @file-upload="selectFile"
      />
      <div v-if="selectedFile" mt-3 data-test-id="parquet-selection">
        <p><span font-600>Name:</span> <bdi>{{ selectedFile.name }}</bdi></p>
        <p><span font-600>Size:</span> {{ formatBytes(selectedFile.size) }} ({{ selectedFile.size.toLocaleString('en-US') }} bytes)</p>
      </div>
      <div class="c-task-actions" mt-3>
        <c-button type="primary" data-test-id="parquet-inspect" :disabled="!fileAccepted || running" @click="inspect">
          {{ running && !inspection ? 'Inspecting…' : 'Inspect metadata' }}
        </c-button>
        <c-button v-if="running" type="warning" data-test-id="parquet-cancel" @click="cancel">
          Cancel
        </c-button>
        <c-button data-test-id="parquet-clear" :disabled="!selectedFile && !inspection" @click="clear">
          Clear
        </c-button>
      </div>
    </c-card>

    <p class="c-task-status" data-test-id="parquet-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Parquet reader error" data-test-id="parquet-error">
      {{ error }}
    </c-alert>

    <template v-if="inspection">
      <c-card title="File metadata" data-test-id="parquet-metadata">
        <div class="metadata-grid">
          <p><span font-600>Rows:</span> {{ inspection.numRows.toLocaleString('en-US') }}</p>
          <p><span font-600>Row groups:</span> {{ inspection.rowGroupCount.toLocaleString('en-US') }}</p>
          <p><span font-600>Top-level columns:</span> {{ inspection.columns.length }}</p>
          <p><span font-600>Parquet version:</span> {{ inspection.version }}</p>
          <p><span font-600>Codecs:</span> {{ inspection.codecs.join(', ') }}</p>
          <p><span font-600>Created by:</span> <bdi>{{ inspection.createdBy || 'not recorded' }}</bdi></p>
          <p><span font-600>Compressed column bytes:</span> {{ inspection.totalCompressedBytes }}</p>
          <p><span font-600>Uncompressed column bytes:</span> {{ inspection.totalUncompressedBytes }}</p>
        </div>
        <c-alert v-if="inspection.unsupportedCodecs.length" mt-3 title="Preview limitation" data-test-id="parquet-unsupported-codecs">
          Unsupported codecs found: {{ inspection.unsupportedCodecs.join(', ') }}. Metadata is available, but affected columns cannot be decoded in this tool.
        </c-alert>
        <details v-if="inspection.metadata.length" mt-4>
          <summary cursor-pointer font-600>
            File key/value metadata ({{ inspection.metadata.length }})
          </summary>
          <div class="table-scroll" mt-2>
            <n-table :bordered="false" :bottom-bordered="false" size="small">
              <thead>
                <tr>
                  <th scope="col">
                    Key
                  </th><th scope="col">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry of inspection.metadata" :key="`${entry.key}\0${entry.value}`">
                  <td><bdi>{{ entry.key }}</bdi></td><td><bdi>{{ entry.value }}</bdi></td>
                </tr>
              </tbody>
            </n-table>
          </div>
        </details>
      </c-card>

      <c-card class="c-task-options" title="Preview columns">
        <div class="c-task-actions" mb-3>
          <c-button :disabled="running" @click="selectFirstColumns">
            Select first {{ PARQUET_MAX_SELECTED_COLUMNS }}
          </c-button>
          <c-button :disabled="running || selectedColumns.length === 0" @click="selectedColumns = []">
            Clear selection
          </c-button>
        </div>
        <div class="column-grid" role="group" :aria-label="`Preview columns; ${selectedColumns.length} of ${PARQUET_MAX_SELECTED_COLUMNS} selected`">
          <CCheckbox
            v-for="column of inspection.columns"
            :key="column.name"
            :checked="selectedColumns.includes(column.name)"
            :disabled="running || (!selectedColumns.includes(column.name) && selectedColumns.length >= PARQUET_MAX_SELECTED_COLUMNS)"
            :test-id="`parquet-column-${column.name}`"
            @update:checked="updateColumn(column.name, $event)"
          >
            <bdi>{{ column.name }}</bdi>
            <span op-65> — {{ column.logicalTypes.join('/') }} · {{ column.codecs.join('/') }}</span>
          </CCheckbox>
        </div>
        <p mt-3 op-70>
          {{ selectedColumns.length }} / {{ PARQUET_MAX_SELECTED_COLUMNS }} columns selected.
        </p>
      </c-card>

      <c-card class="c-task-options" title="Bounded row page">
        <div grid grid-cols-1 gap-3 md:grid-cols-2>
          <c-field label="Zero-based first row" label-for="parquet-row-start">
            <CInputNumber id="parquet-row-start" v-model:value="rowStart" test-id="parquet-row-start" :min="0" :max="Math.max(0, inspection.numRows - 1)" />
          </c-field>
          <c-select v-model:value="rowCount" label="Rows per page" :options="[25, 50, 100, PARQUET_MAX_PREVIEW_ROWS].map(value => ({ label: String(value), value }))" />
        </div>
        <div class="c-task-actions" mt-3>
          <c-button type="primary" data-test-id="parquet-preview" :disabled="!canPreview" @click="loadPreview">
            {{ running ? 'Loading…' : 'Load preview' }}
          </c-button>
          <c-button v-if="running" type="warning" data-test-id="parquet-cancel-preview" @click="cancel">
            Cancel
          </c-button>
        </div>
        <p v-if="unsupportedSelectedCodecs.length" text-warning mt-3 data-test-id="parquet-selected-codec-warning">
          The selection uses unsupported codec(s): {{ unsupportedSelectedCodecs.join(', ') }}.
        </p>
      </c-card>

      <details>
        <summary cursor-pointer font-600>
          Schema ({{ inspection.schema.length }} fields)
        </summary>
        <div class="table-scroll schema-scroll" mt-2 data-test-id="parquet-schema">
          <n-table :bordered="false" :bottom-bordered="false" size="small">
            <thead>
              <tr>
                <th scope="col">
                  Path
                </th><th scope="col">
                  Physical
                </th><th scope="col">
                  Logical
                </th><th scope="col">
                  Repetition
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="field of visibleSchema" :key="field.path">
                <td><code>{{ field.path }}</code></td><td>{{ field.physicalType }}</td><td>{{ field.logicalType }}</td><td>{{ field.repetition }}</td>
              </tr>
            </tbody>
          </n-table>
        </div>
        <p v-if="inspection.schema.length > visibleSchema.length" mt-2 op-70>
          Showing the first {{ visibleSchema.length }} fields to keep the page responsive.
        </p>
      </details>
    </template>

    <template v-if="preview">
      <c-alert v-if="previewStale" title="Preview uses previous options">
        Load the page again to apply the current row or column selection.
      </c-alert>
      <c-card title="Row preview" data-test-id="parquet-preview-result">
        <p mb-3 op-75>
          Rows {{ preview.rowStart.toLocaleString('en-US') }}–{{ Math.max(preview.rowStart, preview.rowEnd - 1).toLocaleString('en-US') }} of {{ preview.totalRows.toLocaleString('en-US') }}.
        </p>
        <div class="table-scroll preview-scroll">
          <n-table :bordered="false" :bottom-bordered="false" size="small" data-test-id="parquet-table">
            <thead>
              <tr>
                <th scope="col">
                  Row
                </th><th v-for="column of preview.columns" :key="column" scope="col">
                  <bdi>{{ column }}</bdi>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) of preview.rows" :key="preview.rowStart + rowIndex">
                <th scope="row">
                  {{ preview.rowStart + rowIndex }}
                </th>
                <td v-for="(cell, columnIndex) of row" :key="columnIndex">
                  <span class="cell-value"><bdi>{{ cell }}</bdi></span>
                </td>
              </tr>
            </tbody>
          </n-table>
        </div>
        <div class="c-task-actions" mt-3>
          <c-button data-test-id="parquet-copy-json" @click="copy(preview.json, { notificationMessage: 'Parquet preview JSON copied' })">
            Copy JSON
          </c-button>
          <c-button data-test-id="parquet-download-json" @click="downloadTextFile({ content: preview.json, filename: 'parquet-preview.json' })">
            Download JSON
          </c-button>
          <c-button data-test-id="parquet-copy-csv" @click="copy(preview.csv, { notificationMessage: 'Parquet preview CSV copied' })">
            Copy CSV
          </c-button>
          <c-button data-test-id="parquet-download-csv" @click="downloadTextFile({ content: preview.csv, filename: 'parquet-preview.csv' })">
            Download CSV
          </c-button>
        </div>
      </c-card>
    </template>
  </div>
</template>

<style scoped>
.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 0.5rem 1.5rem;
}

.column-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  gap: 0.65rem 1rem;
}

.table-scroll {
  max-width: 100%;
  overflow: auto;
}

.schema-scroll {
  max-height: 32rem;
}

.preview-scroll {
  max-height: 40rem;
}

.cell-value {
  display: block;
  max-width: 28rem;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
