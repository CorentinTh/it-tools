<script setup lang="ts">
import {
  type MarkdownTableAlignment,
  createMarkdownTable,
  generateMarkdownTable,
} from './markdown-table-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const table = ref(createMarkdownTable());
const alignmentOptions: { label: string; value: MarkdownTableAlignment }[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

const output = computed(() => generateMarkdownTable(table.value));

function addColumn() {
  const columnNumber = table.value.headers.length + 1;
  table.value.headers.push(`Column ${columnNumber}`);
  table.value.alignments.push('left');
  table.value.rows.forEach(row => row.push(''));
}

function removeColumn(index: number) {
  if (table.value.headers.length <= 1) {
    return;
  }

  table.value.headers.splice(index, 1);
  table.value.alignments.splice(index, 1);
  table.value.rows.forEach(row => row.splice(index, 1));
}

function addRow() {
  table.value.rows.push(Array.from({ length: table.value.headers.length }, () => ''));
}

function removeRow(index: number) {
  if (table.value.rows.length <= 1) {
    return;
  }

  table.value.rows.splice(index, 1);
}
</script>

<template>
  <div>
    <c-card>
      <div mb-4 flex flex-wrap items-center gap-2>
        <c-button @click="addRow">
          Add row
        </c-button>
        <c-button @click="addColumn">
          Add column
        </c-button>
      </div>

      <n-scrollbar x-scrollable>
        <n-table :bordered="false" :single-line="false" min-w-700px>
          <thead>
            <tr>
              <th v-for="(_, columnIndex) of table.headers" :key="columnIndex" min-w-170px>
                <div flex flex-col gap-2>
                  <c-input-text
                    v-model:value="table.headers[columnIndex]"
                    raw-text
                    :placeholder="`Column ${columnIndex + 1}`"
                    :test-id="`header-${columnIndex}`"
                  />
                  <div flex items-center gap-2>
                    <c-select
                      v-model:value="table.alignments[columnIndex]"
                      :options="alignmentOptions"
                      size="small"
                      flex-1
                    />
                    <c-button
                      circle
                      size="small"
                      variant="text"
                      :disabled="table.headers.length <= 1"
                      @click="removeColumn(columnIndex)"
                    >
                      <icon-mdi-delete-outline />
                    </c-button>
                  </div>
                </div>
              </th>
              <th w-45px />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) of table.rows" :key="rowIndex">
              <td v-for="(_, columnIndex) of table.headers" :key="columnIndex">
                <c-input-text
                  v-model:value="row[columnIndex]"
                  raw-text
                  multiline
                  rows="2"
                  :placeholder="`Row ${rowIndex + 1}, column ${columnIndex + 1}`"
                  :test-id="`cell-${rowIndex}-${columnIndex}`"
                />
              </td>
              <td text-center>
                <c-button
                  circle
                  size="small"
                  variant="text"
                  :disabled="table.rows.length <= 1"
                  @click="removeRow(rowIndex)"
                >
                  <icon-mdi-delete-outline />
                </c-button>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-scrollbar>
    </c-card>

    <n-divider />

    <n-form-item label="Generated Markdown table:">
      <TextareaCopyable :value="output" language="markdown" copy-placement="outside" />
    </n-form-item>
  </div>
</template>
