<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { renderMarkdown } from './markdown-viewer.service';

const rawMd = useStorage('markdown-viewer:raw-md', '# Hello World');
const inputElement = ref<HTMLElement>();
</script>

<template>
  <n-form-item
    label="Your raw markdown"
  >
    <c-input-text
      ref="inputElement"
      v-model:value="rawMd"
      placeholder="Paste your raw markdown here..."
      rows="35"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
    />
  </n-form-item>
  <n-form-item label="Prettified version of your markdown">
    <c-card style="width: 100%; overflow: scroll" v-html="renderMarkdown(rawMd)" />
  </n-form-item>
</template>
