<script setup lang="ts">
import { stringify as stringifyToml } from 'iarna-toml-esm';
import JSON5 from 'json5';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const convertJsonToToml = (value: string) => [stringifyToml(JSON5.parse(value))].flat().join('\n').trim();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToToml(value), '');

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
    output-label="TOML from your JSON"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
