<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = '{\n\t"hello": [\n\t\t"world"\n\t]\n}';
const transformer = (value: string) => withDefaultOnError(() => JSON.stringify(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON.stringify(v),
    message: 'Provided text is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your string / text"
    :input-default="defaultValue"
    input-placeholder="Paste your text here..."
    output-label="JSON stringified version of your string"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
