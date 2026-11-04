<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import JSON5 from 'json5';
import { withDefaultOnError } from '@/utils/defaults';
import { convertArrayToCsv } from './json-to-csv.service';

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return convertArrayToCsv({ array: JSON5.parse(value) });
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your raw JSON"
    input-placeholder="Paste your raw JSON here..."
    output-label="CSV version of your JSON"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
