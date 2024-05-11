<script setup lang="ts">
import { getTextFromHtml, validateHtml } from './extract-text-from-html.service';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return getTextFromHtml(value);
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || validateHtml(value),
    message: 'Provided HTML is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your raw HTML"
    input-placeholder="Paste your raw HTML here..."
    output-label="Text from your HTML"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>

<style lang="less" scoped></style>
