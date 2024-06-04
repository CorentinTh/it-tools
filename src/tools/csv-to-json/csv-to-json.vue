<script setup lang="ts">
import { convertCsvToArray } from './csv-to-json.service';
import FormatTransformer from '@/components/FormatTransformer.vue';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return JSON.stringify(convertCsvToArray(value), null, 2);
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || ((v.includes(',') || v.includes(';')) && v.includes('\n')),
    message: 'Provided CSV is not valid.',
  },
];
</script>

<template>
  <FormatTransformer
    input-label="Your raw CSV"
    input-placeholder="Paste your raw CSV here..."
    output-label="JSON version of your CSV"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
