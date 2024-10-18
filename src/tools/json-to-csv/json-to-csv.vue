<script setup lang="ts">
import JSON5 from 'json5';
import { convertArrayToCsv } from './json-to-csv.service';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = '[\n   {\n      "Age": 18,\n      "Country": "Germany",\n      "Gender": "Male",\n      "Purchased": "N",\n      "Salary": 20000\n   },\n   {\n      "Age": 19,\n      "Country": "France",\n      "Gender": "Female",\n      "Purchased": "N",\n      "Salary": 22000\n   },\n   {\n      "Age": 20,\n      "Country": "England",\n      "Gender": "Female",\n      "Purchased": "N",\n      "Salary": 24000\n   }\n]';

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
    :input-default="defaultValue"
    input-placeholder="Paste your raw JSON here..."
    output-label="CSV version of your JSON"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
