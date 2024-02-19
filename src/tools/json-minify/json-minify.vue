<script setup lang="ts">
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();
const defaultValue = '{\n\t"hello": [\n\t\t"world"\n\t]\n}';
const transformer = (value: string) => withDefaultOnError(() => JSON.stringify(JSON5.parse(value), null, 0), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-minify.invalidMessage'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-minify.inputLabel')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.json-minify.inputPlaceholder')"
    :output-label="t('tools.json-minify.outputLabel')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
