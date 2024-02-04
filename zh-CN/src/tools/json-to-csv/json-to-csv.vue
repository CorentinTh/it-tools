<script setup lang="ts">
import JSON5 from 'json5';
import { convertArrayToCsv } from './json-to-csv.service';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = '[\n\t{"id":"1","title":"BeJSON","url":"www.bejson.com"},\n\t{"id":"2","title":"layui","url":"www.layui.com"}\n]';
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
    message: 'JSON 无效',
  },
];
</script>

<template>
  <format-transformer
    input-label="JSON"
    :input-default="defaultValue"
    input-placeholder="输入 JSON，数组格式"
    output-label="CSV"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
