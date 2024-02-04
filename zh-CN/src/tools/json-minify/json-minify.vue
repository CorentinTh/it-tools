<script setup lang="ts">
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = '{\n\t"bot": null,\n\t"brand": "",\n\t"client": {\n\t\t"engine": "Blink",\n\t\t"engine_version": "119.0.0.0",\n\t\t"family": "Chrome",\n\t\t"name": "Chrome",\n\t\t"short_name": "CH",\n\t\t"type": "browser",\n\t\t"version": "119.0"\n\t},\n\t"device": "desktop",\n\t"model": "",\n\t"os": {\n\t\t"family": "Windows",\n\t\t"name": "Windows",\n\t\t"platform": "x64",\n\t\t"short_name": "WIN",\n\t\t"version": "10"\n\t}\n}';
const transformer = (value: string) => withDefaultOnError(() => JSON.stringify(JSON5.parse(value), null, 0), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'JSON 无效',
  },
];
</script>

<template>
  <format-transformer
    input-label="原始 JSON"
    :input-default="defaultValue"
    input-placeholder="输入原始 JSON"
    output-label="压缩后的 JSON"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
