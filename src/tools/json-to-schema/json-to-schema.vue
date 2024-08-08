<script setup lang="ts">
import JSON5 from 'json5';
import GenerateSchema from 'generate-schema';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const formats = [
  { value: 'generic', label: 'Generic' },
  { value: 'json', label: 'JSON Schema' },
  { value: 'mysql', label: 'MySQL Table Schema' },
  { value: 'mongoose', label: 'Mongoose Schema' },
  { value: 'bigquery', label: 'Google BigQuery schema' },
  { value: 'clickhouse', label: 'ClickHouse Table Schema' },
];

const tableName = ref('TableName');
const format = useQueryParamOrStorage({ name: 'fmt', storageName: 'json-to-schema:fmt', defaultValue: 'json' });

function convertJsonToSchema(value: string) {
  const object = JSON5.parse(value);
  switch (format.value) {
    case 'json':
      return JSON.stringify(GenerateSchema.json(tableName.value, object), null, 2);
    case 'mysql':
      return GenerateSchema.mysql(tableName.value, object);
    case 'mongoose':
      return JSON.stringify(GenerateSchema.mongoose(object), null, 2);
    case 'bigquery':
      return JSON.stringify(GenerateSchema.bigquery(object), null, 2);
    case 'clickhouse':
      return JSON.stringify(GenerateSchema.clickhouse(tableName.value, object, 'theDateField'), null, 2);
    default:
      return JSON.stringify(GenerateSchema.generic(object), null, 2);
  }
}
const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToSchema(value), '');
const schemaLanguage = computed(() => {
  switch (format.value) {
    case 'mysql':
      return 'sql';
    case 'mongoose':
      return 'json';
    case 'bigquery':
      return 'json';
    case 'clickhouse':
      return 'json';
    default:
      return 'json';
  }
});

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <div>
    <c-select
      v-model:value="format"
      :options="formats"
      placeholder="Target Schema format"
    />
    <c-input-text
      v-if="['clickhouse', 'json', 'mysql'].includes(format)"
      v-model:value="tableName"
      label="Table Name"
      placeholder="Table Name"
      mb-2
    />
    <n-divider />

    <format-transformer
      input-label="Your JSON"
      input-placeholder="Paste your JSON here..."
      output-label="Your schema"
      :output-language="schemaLanguage"
      :input-validation-rules="rules"
      :transformer="transformer"
    />
  </div>
</template>
