<script setup lang="ts">
import JSON2TS from 'json-to-ts';
import JSON5 from 'json5';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

function convertJsonToTs(value: string) {
  return JSON2TS(JSON5.parse(value), { rootName: 'DataProps' }).join('\n\n').trim();
}

function transformer(value: string) {
  return value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToTs(value), '');
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
    input-label="Your JSON"
    input-placeholder="Paste your JSON here..."
    output-label="TS from your JSON"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
