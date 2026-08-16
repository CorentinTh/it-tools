<script setup lang="ts">
import { renderSafeMarkdownPreview } from './markdown-diff-preview.service';

const props = defineProps<{ source: string }>();
const html = computed(() => renderSafeMarkdownPreview(props.source));
</script>

<template>
  <div class="markdown-diff-preview" v-html="html" />
</template>

<style scoped>
.markdown-diff-preview {
  min-height: 18rem;
  overflow-wrap: anywhere;
}

.markdown-diff-preview :deep(pre) {
  overflow-x: auto;
  white-space: pre-wrap;
}

.markdown-diff-preview :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
}
</style>
