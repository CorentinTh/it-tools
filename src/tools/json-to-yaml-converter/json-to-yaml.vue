<template>
  <format-transformer
    input-label="Your JSON"
    input-placeholder="Paste your JSON here..."
    output-label="YAML from your JSON"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>

<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { stringify } from 'yaml';
import JSON5 from 'json5';

const transformer = (value: string) => withDefaultOnError(() => stringify(JSON5.parse(value)), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => stringify(JSON5.parse(value))),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<style lang="less" scoped></style>
