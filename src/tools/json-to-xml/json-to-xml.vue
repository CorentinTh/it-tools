<script setup lang="ts">
import convert from 'xml-js';
import JSON5 from 'json5';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();
const defaultValue = '{"a":{"_attributes":{"x":"1.234","y":"It\'s"}}}';
function transformer(value: string) {
  return withDefaultOnError(() => {
    return convert.js2xml(JSON5.parse(value), { compact: true });
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-xml.error'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-xml.input')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.json-to-xml.input-placeholder')"
    :output-label="t('tools.json-to-xml.output')"
    output-language="xml"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
