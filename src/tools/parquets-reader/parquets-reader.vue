<script setup lang="ts">
// import { Buffer } from 'node:buffer';
import { parquetReadObjects } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';
import type { DataTableInst } from 'naive-ui';

const fileInput = ref() as Ref<File | null>;

const error = ref('');

const results = computedAsync(async () => {
  const file = fileInput.value;
  error.value = '';
  if (file == null) {
    return null;
  }
  try {
    return await parquetReadObjects({ file: await file.arrayBuffer(), compressors });
  }
  catch (e: any) {
    error.value = e.toString();
    return [];
  }
});
const resultsJson = computed(() => JSON.stringify(results.value || [], (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));

const columns = computed(() => Object.keys((results.value || [])[0] || {})
  .map(h => ({ key: h.replace(/\./g, '\\.'), title: h })));

function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}

const tableRef = ref<DataTableInst>();
function downloadCsv() {
  tableRef.value?.downloadCsv({ fileName: fileInput.value?.name || 'data' });
}
</script>

<template>
  <div style="max-width: 600px;">
    <c-card title="Input" mb-2>
      <c-file-upload
        title="Drag and drop Parquet file here, or click to select a file"
        @file-upload="onUpload"
      />
    </c-card>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <n-tabs v-if="!error" type="line" animated>
      <n-tab-pane name="jsonData" tab="JSON Content">
        <textarea-copyable :value="resultsJson" language="json" :download-file-name="`${fileInput?.name}.json`" />
      </n-tab-pane>
      <n-tab-pane v-if="columns.length" name="tabData" tab="Table View">
        <div mb-1 flex justify-center>
          <n-button @click="downloadCsv">
            Export as CSV
          </n-button>
        </div>
        <n-data-table
          ref="tableRef"
          size="small"
          :columns="columns"

          :data="results" bordered striped
          pagination
        />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
