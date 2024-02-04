<script setup lang="ts">
import { parse as parseYaml } from 'yaml';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

function transformer(value: string) {
  return withDefaultOnError(() => {
    const obj = parseYaml(value);
    return obj ? JSON.stringify(obj, null, 3) : '';
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => isNotThrowing(() => parseYaml(value)),
    message: '无效的YAML',
  },
];
</script>

<template>
  <format-transformer
    input-label="YAML"
    input-placeholder="请输入yaml"
    output-label="JSON"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
