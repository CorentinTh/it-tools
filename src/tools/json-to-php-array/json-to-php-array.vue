<script setup lang="ts">
import jsonar from 'jsonar-mod';
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = `{
  a:"b", 
  arr: [1, "2"], 
  nested: {
    c:12, 
    d: "az"
  }
}`;
function transformer(value: string) {
  return withDefaultOnError(() => jsonar.arrify(JSON5.parse(value), { prettify: true }), '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your JSON"
    :input-default="defaultValue"
    input-placeholder="Paste your JSON here..."
    output-label="PHP Array version"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
