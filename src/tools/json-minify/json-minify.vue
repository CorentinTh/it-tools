<template>
  <format-transformer
    input-label="Your raw json"
    :input-default="defaultValue"
    input-placeholder="Paste your raw json here..."
    output-label="Minify version of your JSON"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>

<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import JSON5 from 'json5';

const defaultValue = '{\n\t"hello": [\n\t\t"world"\n\t]\n}';
const transformer = (value: string) => withDefaultOnError(() => JSON.stringify(JSON5.parse(value), null, 0), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>
