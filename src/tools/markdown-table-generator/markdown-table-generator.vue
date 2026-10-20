<script setup lang="ts">
import { generateMarkdownTable } from './markdown-table-generator.models';
import { useCopy } from '@/composable/copy';

const rows = ref<string[][]>([
  ['Header 1', 'Header 2', 'Header 3'],
  ['Cell 1', 'Cell 2', 'Cell 3'],
  ['Cell 4', 'Cell 5', 'Cell 6'],
]);

const columnCount = computed(() => Math.max(...rows.value.map(row => row.length), 1));

const markdown = computed(() => generateMarkdownTable(rows.value));
const { copy } = useCopy({ source: markdown });

function addRow() {
  rows.value.push(Array.from({ length: columnCount.value }, () => ''));
}

function addColumn() {
  for (const row of rows.value) {
    row.push('');
  }
}

function removeRow(index: number) {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1);
  }
}

function removeColumn(index: number) {
  if (columnCount.value > 1) {
    for (const row of rows.value) {
      if (row.length > index) {
        row.splice(index, 1);
      }
    }
  }
}
</script>

<template>
  <c-card title="Table editor" mb-3>
    <div mb-3 flex gap-2>
      <c-button size="small" @click="addRow()">
        + Row
      </c-button>
      <c-button size="small" @click="addColumn()">
        + Column
      </c-button>
    </div>

    <div overflow-x-auto>
      <table border-collapse>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <td
              v-for="(_, colIndex) in row"
              :key="colIndex"
            >
              <n-input
                v-model:value="rows[rowIndex][colIndex]"
                :placeholder="rowIndex === 0 ? `Header ${colIndex + 1}` : ''"
                size="small"
                :test-id="`cell-${rowIndex}-${colIndex}`"
              />
            </td>
            <td>
              <c-button
                size="small"
                variant="text"
                :disabled="rows.length <= 1"
                data-test-id="remove-row"
                @click="removeRow(rowIndex)"
              >
                ✕
              </c-button>
            </td>
          </tr>
          <tr>
            <td v-for="colIndex in columnCount" :key="colIndex">
              <c-button
                size="small"
                variant="text"
                :disabled="columnCount <= 1"
                :data-test-id="`remove-column-${colIndex}`"
                @click="removeColumn(colIndex - 1)"
              >
                ✕
              </c-button>
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  </c-card>

  <c-card title="Markdown output">
    <c-input-text
      :value="markdown"
      label="GFM Markdown table"
      multiline
      readonly
      raw-text
      autosize
      test-id="markdown-output"
    />
    <div mt-2 flex justify-center>
      <c-button :disabled="!markdown" @click="copy()">
        Copy Markdown to clipboard
      </c-button>
    </div>
  </c-card>
</template>
