<script setup lang="ts">
import MarkdownContents from 'markdown-contents';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = `# A title 1

## A title level 2

# Another title 1

## Another title level 2
`;
function transformer(value: string) {
  return withDefaultOnError(() => {
    const generator = MarkdownContents(value);
    return generator.markdown();
  }, '');
}
</script>

<template>
  <format-transformer
    input-label="Your Markdown content"
    :input-default="defaultValue"
    input-placeholder="Paste your Markdown content here..."
    output-label="Generated Markdown TOC"
    output-language="markdown"
    :transformer="transformer"
  />
</template>
