<script setup lang="ts">
import { XlsxReaderWorkerClient } from './xlsx-reader.worker-client';
import {
  XLSX_MAX_COLUMNS,
  XLSX_MAX_FILE_BYTES,
  XLSX_MAX_FILE_LABEL,
  XLSX_MAX_PREVIEW_COLUMNS,
  XLSX_MAX_PREVIEW_ROWS,
  XLSX_MAX_ROWS,
  type XlsxInspectionResult,
  type XlsxPreviewResult,
  XlsxReaderTaskError,
} from './xlsx-reader.types';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';
import { formatBytes } from '@/utils/convert';

const client = new XlsxReaderWorkerClient();
const selectedFile = shallowRef<File>();
const inspection = shallowRef<XlsxInspectionResult>();
const preview = shallowRef<XlsxPreviewResult>();
const sheetIndex = ref(0);
const rowStart = ref(1);
const rowCount = ref(50);
const columnStart = ref(1);
const columnCount = ref(16);
const running = ref(false);
const error = ref('');
const status = ref('Select a local .xlsx file. Nothing is read until you choose Inspect workbook.');
const completedPreviewSignature = ref('');
let operation = 0;

const { copy } = useCopy({ createToast: true });
const fileAccepted = computed(() => Boolean(selectedFile.value && selectedFile.value.size > 0 && selectedFile.value.size <= XLSX_MAX_FILE_BYTES));
const sheetOptions = computed(() => inspection.value?.sheets.map((sheet, index) => ({
  label: `${index + 1}. ${sheet.name}${sheet.state === 'visible' ? '' : ` (${sheet.state})`}${sheet.kind === 'worksheet' ? '' : ' — unsupported sheet type'}`,
  value: index,
  disabled: !sheet.previewSupported,
})) ?? []);
const selectedSheet = computed(() => inspection.value?.sheets[sheetIndex.value]);
const canPreview = computed(() => Boolean(selectedFile.value && inspection.value && selectedSheet.value?.previewSupported && !running.value));
const previewSignature = computed(() => [selectedFile.value?.name, selectedFile.value?.size, sheetIndex.value, rowStart.value, rowCount.value, columnStart.value, columnCount.value].join('\0'));
const previewStale = computed(() => Boolean(preview.value && completedPreviewSignature.value !== previewSignature.value));

function resetResults(): void {
  inspection.value = undefined;
  preview.value = undefined;
  sheetIndex.value = 0;
  rowStart.value = 1;
  rowCount.value = 50;
  columnStart.value = 1;
  columnCount.value = 16;
  completedPreviewSignature.value = '';
}

function selectFile(file: File): void {
  operation += 1;
  client.cancel('XLSX processing was cancelled because a different file was selected.');
  selectedFile.value = file;
  resetResults();
  error.value = '';
  status.value = file.size > 0 && file.size <= XLSX_MAX_FILE_BYTES
    ? 'File selected. Choose Inspect workbook to validate its ZIP package and bounded metadata locally.'
    : file.size === 0 ? 'Empty files cannot be inspected.' : `The selected file exceeds the ${XLSX_MAX_FILE_LABEL} limit.`;
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
  status.value = 'Validating the XLSX ZIP package and workbook metadata in a disposable worker…';
  try {
    const task = await client.run({ kind: 'inspect', file });
    if (current !== operation || file !== selectedFile.value || task.value.kind !== 'inspection') {
      return;
    }
    inspection.value = task.value;
    const firstSupported = task.value.sheets.findIndex(sheet => sheet.previewSupported);
    sheetIndex.value = Math.max(0, firstSupported);
    status.value = `Workbook inspected in ${Math.round(task.elapsedMs)} ms. Select one worksheet and one bounded row/column page.`;
  }
  catch (caught) {
    if (current !== operation) {
      return;
    }
    error.value = caught instanceof XlsxReaderTaskError ? caught.message : 'XLSX workbook inspection failed.';
    status.value = caught instanceof XlsxReaderTaskError && caught.code === 'cancelled' ? 'Workbook inspection was cancelled.' : 'Workbook inspection failed.';
  }
  finally {
    if (current === operation) {
      running.value = false;
    }
  }
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
  status.value = 'Reading only the required XLSX parts and selected worksheet page in a disposable worker…';
  try {
    const task = await client.run({
      kind: 'preview',
      file,
      sheetIndex: sheetIndex.value,
      rowStart: rowStart.value,
      rowCount: rowCount.value,
      columnStart: columnStart.value,
      columnCount: columnCount.value,
    });
    if (current !== operation || file !== selectedFile.value || task.value.kind !== 'preview') {
      return;
    }
    preview.value = task.value;
    completedPreviewSignature.value = signature;
    status.value = `Worksheet page decoded in ${Math.round(task.elapsedMs)} ms. Only cached formula results were read; formulas were never executed.`;
  }
  catch (caught) {
    if (current !== operation) {
      return;
    }
    error.value = caught instanceof XlsxReaderTaskError ? caught.message : 'XLSX worksheet preview failed.';
    status.value = caught instanceof XlsxReaderTaskError && caught.code === 'cancelled' ? 'Worksheet preview was cancelled.' : 'Worksheet preview failed.';
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
  status.value = 'XLSX processing was cancelled; its disposable worker was terminated.';
}

function clear(): void {
  operation += 1;
  client.cancel('XLSX processing was cancelled because the tool was cleared.');
  selectedFile.value = undefined;
  resetResults();
  error.value = '';
  running.value = false;
  status.value = 'File, workbook metadata, preview, and exports were cleared from this page.';
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
    <c-alert title="Local, bounded XLSX inspection">
      Files stay in this page and are never uploaded or persisted. An explicit disposable worker validates the ZIP central directory, CRC-32, package relationships, and UTF-8 XML, then reads only required workbook parts and the selected page. Files are capped at {{ XLSX_MAX_FILE_LABEL }}; ZIP entries, compressed and inflated bytes, XML structure, sheets, cells, preview, export, and 15-second limits apply independently.
    </c-alert>
    <c-alert title="Conservative spreadsheet surface">
      This reader accepts macro-free .xlsx only. It never executes formulas, macros, external links, data connections, or embedded objects and never fetches relationship targets. Preview/export use stored cell values and cached formula results as strings, preserving numeric lexemes instead of guessing precision or dates. CSV formula-like cells are prefixed with an apostrophe. Legacy .xls, .xlsm, ZIP64, encrypted archives, non-UTF-8 XML, and whole-workbook export are not supported.
    </c-alert>

    <c-card class="c-task-options" title="Local XLSX file">
      <c-file-upload
        data-test-id="xlsx-upload"
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :title="`Drop one .xlsx file here, or select it (maximum ${XLSX_MAX_FILE_LABEL})`"
        @file-upload="selectFile"
      />
      <div v-if="selectedFile" mt-3 data-test-id="xlsx-selection">
        <p><span font-600>Name:</span> <bdi>{{ selectedFile.name }}</bdi></p>
        <p><span font-600>Size:</span> {{ formatBytes(selectedFile.size) }} ({{ selectedFile.size.toLocaleString('en-US') }} bytes)</p>
      </div>
      <div class="c-task-actions" mt-3>
        <c-button type="primary" data-test-id="xlsx-inspect" :disabled="!fileAccepted || running" @click="inspect">
          {{ running && !inspection ? 'Inspecting…' : 'Inspect workbook' }}
        </c-button>
        <c-button v-if="running" type="warning" data-test-id="xlsx-cancel" @click="cancel">
          Cancel
        </c-button>
        <c-button data-test-id="xlsx-clear" :disabled="!selectedFile && !inspection" @click="clear">
          Clear
        </c-button>
      </div>
    </c-card>

    <p class="c-task-status" data-test-id="xlsx-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="XLSX reader error" data-test-id="xlsx-error">
      {{ error }}
    </c-alert>

    <template v-if="inspection">
      <c-card title="Workbook metadata" data-test-id="xlsx-metadata">
        <div class="metadata-grid">
          <p><span font-600>Worksheets/items:</span> {{ inspection.sheets.length }}</p>
          <p><span font-600>ZIP entries:</span> {{ inspection.entryCount }}</p>
          <p><span font-600>Declared compressed bytes:</span> {{ inspection.totalCompressedBytes.toLocaleString('en-US') }}</p>
          <p><span font-600>Declared uncompressed bytes:</span> {{ inspection.totalUncompressedBytes.toLocaleString('en-US') }}</p>
          <p><span font-600>Date system:</span> {{ inspection.dateSystem }} (serials stay raw)</p>
          <p><span font-600>Shared strings:</span> {{ inspection.hasSharedStrings ? formatBytes(inspection.sharedStringsBytes) : 'not present' }}</p>
          <p><span font-600>Styles part:</span> {{ inspection.stylesBytes ? formatBytes(inspection.stylesBytes) : 'not present' }}</p>
          <p><span font-600>External-link declarations:</span> {{ inspection.externalLinkCount }} (never followed)</p>
        </div>
        <c-alert v-if="inspection.externalLinkCount" mt-3 title="External content ignored">
          This workbook declares {{ inspection.externalLinkCount }} external relationship(s). The reader does not fetch or resolve them; stored cached values may be stale.
        </c-alert>
      </c-card>

      <c-card class="c-task-options" title="Bounded worksheet page">
        <c-select v-model:value="sheetIndex" label="Worksheet" data-test-id="xlsx-sheet" :options="sheetOptions" />
        <div grid grid-cols-1 mt-3 gap-3 md:grid-cols-2>
          <c-field label="First row (1-based)" label-for="xlsx-row-start">
            <CInputNumber id="xlsx-row-start" v-model:value="rowStart" test-id="xlsx-row-start" :min="1" :max="XLSX_MAX_ROWS - rowCount + 1" />
          </c-field>
          <c-select v-model:value="rowCount" label="Rows per page" :options="[25, 50, 100, XLSX_MAX_PREVIEW_ROWS].map(value => ({ label: String(value), value }))" />
          <c-field label="First column (1 = A)" label-for="xlsx-column-start">
            <CInputNumber id="xlsx-column-start" v-model:value="columnStart" test-id="xlsx-column-start" :min="1" :max="XLSX_MAX_COLUMNS - columnCount + 1" />
          </c-field>
          <c-select v-model:value="columnCount" label="Columns per page" :options="[8, 16, XLSX_MAX_PREVIEW_COLUMNS].map(value => ({ label: String(value), value }))" />
        </div>
        <p v-if="selectedSheet && !selectedSheet.previewSupported" text-warning mt-3>
          This item is not a worksheet or its inflated XML exceeds the {{ formatBytes(16 * 1024 * 1024) }} page-reader limit.
        </p>
        <div class="c-task-actions" mt-3>
          <c-button type="primary" data-test-id="xlsx-preview" :disabled="!canPreview" @click="loadPreview">
            {{ running ? 'Loading…' : 'Load selected page' }}
          </c-button>
          <c-button v-if="running" type="warning" data-test-id="xlsx-cancel-preview" @click="cancel">
            Cancel
          </c-button>
        </div>
      </c-card>

      <c-card title="Workbook sheets">
        <div class="table-scroll">
          <n-table :bordered="false" :bottom-bordered="false" size="small" data-test-id="xlsx-sheets-table">
            <thead>
              <tr>
                <th scope="col">
                  #
                </th><th scope="col">
                  Name
                </th><th scope="col">
                  State/type
                </th><th scope="col">
                  Compressed
                </th><th scope="col">
                  Inflated
                </th><th scope="col">
                  Page preview
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sheet, index) of inspection.sheets" :key="`${index}-${sheet.name}`">
                <th scope="row">
                  {{ index + 1 }}
                </th><td><bdi>{{ sheet.name }}</bdi></td><td>{{ sheet.state }} / {{ sheet.kind }}</td>
                <td>{{ formatBytes(sheet.compressedBytes) }}</td><td>{{ formatBytes(sheet.uncompressedBytes) }}</td><td>{{ sheet.previewSupported ? 'available' : 'unsupported' }}</td>
              </tr>
            </tbody>
          </n-table>
        </div>
      </c-card>
    </template>

    <template v-if="preview">
      <c-alert v-if="previewStale" title="Preview uses previous options">
        Load the page again to apply the current worksheet, row, or column selection.
      </c-alert>
      <c-alert v-if="preview.formulaCellCount" title="Cached formula results only" data-test-id="xlsx-formula-note">
        The selected page contains {{ preview.formulaCellCount }} formula cell(s). No formula was executed; {{ preview.missingFormulaResultCount }} had no cached result and remain empty.
      </c-alert>
      <c-card title="Worksheet preview" data-test-id="xlsx-preview-result">
        <p mb-3 op-75>
          <bdi>{{ preview.sheetName }}</bdi>: rows {{ preview.rowStart }}–{{ preview.rowEnd }}, columns {{ preview.columns[0] }}–{{ preview.columns.at(-1) }}. Declared used rows: {{ preview.totalRows.toLocaleString('en-US') }}.
        </p>
        <div class="table-scroll preview-scroll">
          <n-table :bordered="false" :bottom-bordered="false" size="small" data-test-id="xlsx-table">
            <thead>
              <tr>
                <th scope="col">
                  Row
                </th><th v-for="column of preview.columns" :key="column" scope="col">
                  {{ column }}
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
          <c-button data-test-id="xlsx-copy-json" @click="copy(preview.json, { notificationMessage: 'XLSX page JSON copied' })">
            Copy JSON
          </c-button>
          <c-button data-test-id="xlsx-download-json" @click="downloadTextFile({ content: preview.json, filename: 'xlsx-page.json' })">
            Download JSON
          </c-button>
          <c-button data-test-id="xlsx-copy-csv" @click="copy(preview.csv, { notificationMessage: 'XLSX page CSV copied' })">
            Copy CSV
          </c-button>
          <c-button data-test-id="xlsx-download-csv" @click="downloadTextFile({ content: preview.csv, filename: 'xlsx-page.csv' })">
            Download CSV
          </c-button>
        </div>
      </c-card>
    </template>
  </div>
</template>

<style scoped>
.metadata-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: 0.5rem 1.5rem; }
.table-scroll { max-width: 100%; overflow: auto; }
.preview-scroll { max-height: 40rem; }
.cell-value { display: block; max-width: 28rem; overflow-wrap: anywhere; white-space: pre-wrap; }
</style>
