<script setup lang="ts">
import { useElementSize, useStorage } from '@vueuse/core';
import { renderMarkdown } from './markdown-viewer.service';

const inputElement = ref<HTMLElement>();
const rawMd = useStorage('markdown-viewer:raw-md', '# Hello World');
const { height } = useElementSize(inputElement);

const cardStyles = computed(() => ({
  width: '100%',
  overflow: 'scroll',
  maxHeight: `${height.value}px`,
}));
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
    <c-card :style="cardStyles" v-html="renderMarkdown(rawMd)" />
  </n-form-item>
</template>
