<script setup lang="ts">
import { parseCsv } from './csv-to-json.service';
import { withDefaultOnError } from '@/utils/defaults';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const rawCsv = ref(`name,role,active
Alice,admin,true
Bob,editor,false`);

const delimiter = useStorage('csv-to-json:delimiter', ',');
const hasHeaders = useStorage('csv-to-json:headers', true);
const inferTypes = useStorage('csv-to-json:infer', true);
const trimFields = useStorage('csv-to-json:trim', true);

const parsed = computed(() =>
  withDefaultOnError(
    () => parseCsv(rawCsv.value, { delimiter: delimiter.value, hasHeaders: hasHeaders.value, inferTypes: inferTypes.value, trimFields: trimFields.value }),
    { headers: [], records: [] },
  ),
);

const jsonOutput = computed(() => JSON.stringify(parsed.value.records, null, 2));
const delimiterOptions = [
  { label: 'Comma (,)', value: ',' },
  { label: 'Semicolon (;)', value: ';' },
  { label: 'Tab (\\t)', value: '\t' },
  { label: 'Pipe (|)', value: '|' },
];
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="rawCsv"
      label="Your CSV"
      placeholder="Paste CSV here..."

      rows="6"
      raw-text multiline mb-3
    />

    <n-grid cols="4" x-gap="12" mb-3>
      <n-gi>
        <c-select v-model:value="delimiter" label="Delimiter" label-position="top" :options="delimiterOptions" />
      </n-gi>
      <n-gi span="3">
        <div h-full flex items-center gap-6>
          <n-form-item label="First row is headers" label-placement="left" :show-feedback="false" mb-0>
            <n-switch v-model:value="hasHeaders" />
          </n-form-item>
          <n-form-item label="Infer types" label-placement="left" :show-feedback="false" mb-0>
            <n-switch v-model:value="inferTypes" />
          </n-form-item>
          <n-form-item label="Trim fields" label-placement="left" :show-feedback="false" mb-0>
            <n-switch v-model:value="trimFields" />
          </n-form-item>
        </div>
      </n-gi>
    </n-grid>

    <n-form-item label="JSON output:" label-placement="top">
      <TextareaCopyable :value="jsonOutput" copy-placement="outside" mb-1 />
    </n-form-item>

    <div text-xs op-60>
      {{ parsed.headers.length }} columns · {{ parsed.records.length }} records · RFC 4180 quoted fields supported
    </div>
  </c-card>
</template>
