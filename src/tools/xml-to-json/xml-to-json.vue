<script setup lang="ts">
import convert from 'xml-js';
import { isValidXML } from '../xml-formatter/xml-formatter.service';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();
const defaultValue = '<a x="1.234" y="It\'s"/>';
function transformer(value: string) {
  return withDefaultOnError(() => {
    return JSON.stringify(convert.xml2js(value, { compact: true }), null, 2);
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidXML,
    message: t('tools.xml-to-json.invalidMessage'),
  },
];
</script>

<template>
  <format-transformer
    input-label="t('tools.xml-to-json.inputLabel')"
    :input-default="defaultValue"
    input-placeholder="t('tools.xml-to-json.inputPlaceholder')"
    output-label="t('tools.xml-to-json.outputLabel')"
    output-language="json"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
