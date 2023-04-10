<template>
  <format-transformer
    input-label="Your YAML"
    input-placeholder="Paste your yaml here..."
    output-label="JSON from your YAML"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>

<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { parse as parseYaml } from 'yaml';

const transformer = (value: string) =>
  withDefaultOnError(() => {
    const obj = parseYaml(value);
    return obj ? JSON.stringify(obj, null, 3) : '';
  }, '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => isNotThrowing(() => parseYaml(value)),
    message: 'Provided YAML is not valid.',
  },
];
</script>

<style lang="less" scoped></style>
