<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { marked } from "marked";
const rawMd = useStorage('markdown-viewer:raw-md', '# Hello World');
const inputElement = ref<HTMLElement>();
import highlight from "highlight.js";
import 'highlight.js/styles/default.css';

const renderMarkdown = (md: string) => {
  const renderer = new marked.Renderer();

  // Override the code rendering function to use highlight.js for syntax highlighting
  renderer.code = (code: string, language: string) => {
    const validLanguage = highlight.getLanguage(language) ? language : 'plaintext';
    return `<pre><code class="hljs ${validLanguage}">${highlight.highlight(validLanguage, code).value}</code></pre>`;
  };

  marked.use({ renderer });

  return marked.parse(md)
}

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
