<script setup lang="ts">
import TurndownService from 'turndown';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

const transformer = (value: string) => withDefaultOnError(() => turndown.turndown(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || isNotThrowing(() => turndown.turndown(v)),
    message: 'Provided HTML is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your HTML"
    input-placeholder="Paste your HTML here..."
    output-label="Markdown from your HTML"
    output-language="markdown"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
