<script setup lang="ts">
import { useStorage } from '@vueuse/core';
const rawMd = useStorage('markdown-viewer:raw-md', '# Hello World');
const inputElement = ref<HTMLElement>();
import { renderMarkdown } from "./markdown-viewer.service";

</script>

<template>
  <n-form-item
      label="Your raw MD"
  >
    <c-input-text
        ref="inputElement"
        v-model:value="rawMd"
        placeholder="Paste your raw JSON here..."
        rows="35"
        multiline
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        monospace
    />
  </n-form-item>
  <n-form-item label="Prettified version of your MD">
    <c-card style="width: 100%; overflow: scroll" v-html="renderMarkdown(rawMd)"></c-card>
  </n-form-item>
</template>

<style lang="less" scoped>
.result-card {
  position: relative;
  .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
