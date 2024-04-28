<script setup lang="ts">
import { formatContent } from 'nginx-config-formatter';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = '{\n\t"hello": [\n\t\t"world"\n\t]\n}';
const transformer = (value: string) => withDefaultOnError(() => formatContent(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || formatContent(v),
    message: 'Provided Nginx config is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your Nginx config"
    :input-default="defaultValue"
    input-placeholder="Paste your Nginx config here..."
    output-label="Prettified Nginx config"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
