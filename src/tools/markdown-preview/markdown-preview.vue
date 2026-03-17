<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { renderMarkdown } from './markdown-preview.service';

const inputMarkdown = useStorage('markdown-preview:input', '');
const previewHtml = computed(() => renderMarkdown(inputMarkdown.value));
</script>

<template>
  <div class="markdown-preview-tool">
    <c-input-text
      v-model:value="inputMarkdown"

      placeholder="Your Markdown content..."
      rows="8"

      label="Your Markdown to preview:"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      raw-text autofocus multiline monospace
      test-id="markdown-input"
    />

    <n-divider />

    <n-form-item label="Rendered preview:">
      <c-card>
        <div
          class="markdown-preview"
          data-test-id="markdown-preview"
          v-html="previewHtml"
        />
      </c-card>
    </n-form-item>
  </div>
</template>

<style lang="less" scoped>
.markdown-preview-tool {
  flex: 0 0 100%;
}

.markdown-preview {
  overflow: auto;
  width: 100%;
  min-height: 200px;
  max-height: 600px;
  box-sizing: border-box;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  :deep(h1) { font-size: 1.5em; }
  :deep(h2) { font-size: 1.3em; }
  :deep(h3) { font-size: 1.1em; }
  :deep(h1), :deep(h2), :deep(h3) { margin: 0.5em 0; line-height: 1.3; }
  :deep(p), :deep(ul), :deep(ol) { margin: 0.5em 0; line-height: 1.6; }
  :deep(ul), :deep(ol) { padding-left: 1.5em; }
  :deep(code) { background: var(--n-color-modal); padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; }
  :deep(pre) { background: var(--n-color-modal); padding: 12px; border-radius: 6px; overflow-x: auto; margin: 0.5em 0; }
  :deep(pre code) { background: none; padding: 0; font-size: 0.9em; }
  :deep(a) { color: var(--n-color-primary); text-decoration: none; }
  :deep(a:hover) { text-decoration: underline; }
}
</style>
