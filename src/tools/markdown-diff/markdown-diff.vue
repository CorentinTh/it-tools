<template>
  <div class="markdown-diff-tool">
    <div flex justify-center mb-4>
      <c-buttons-select
        v-model:value="mode"
        :options="modeOptions"
        size="small"
      />
    </div>

    <c-card v-if="mode === 'code'" w-full important:flex-1 important:pa-0>
      <c-diff-editor
        v-model:original="sourceMarkdown"
        v-model:modified="targetMarkdown"
        test-id="markdown-diff-editor"
        language="markdown"
        height="clamp(620px, 72vh, 820px)"
      />
    </c-card>

    <c-card v-else data-test-id="markdown-preview" w-full>
      <div class="markdown-preview-grid">
        <section>
          <h3>Source Markdown</h3>
          <div class="markdown-preview-pane" data-test-id="source-markdown-preview">
            <c-markdown :markdown="sourceMarkdown" />
          </div>
        </section>

        <section>
          <h3>Modified Markdown</h3>
          <div class="markdown-preview-pane" data-test-id="modified-markdown-preview">
            <c-markdown :markdown="targetMarkdown" />
          </div>
        </section>
      </div>
    </c-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { modifiedMarkdown, originalMarkdown } from './markdown-diff.constants';

type MarkdownDiffMode = 'code' | 'preview';

const mode = ref<MarkdownDiffMode>('code');
const sourceMarkdown = ref(originalMarkdown);
const targetMarkdown = ref(modifiedMarkdown);

const modeOptions: Array<{ label: string; value: MarkdownDiffMode }> = [
  { label: 'Code', value: 'code' },
  { label: 'Preview', value: 'preview' },
];
</script>

<style lang="less" scoped>
.markdown-preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  section {
    min-width: 0;
  }

  h3 {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 600;
  }
}

.markdown-diff-tool {
  width: 100%;
  max-width: 1200px;
  flex: 1 1 1200px !important;
}

.markdown-preview-pane {
  min-height: clamp(620px, 72vh, 820px);
  padding: 18px;
  border: 1px solid #d8dee8;
  border-radius: 8px;
  overflow: auto;
}

:deep(.markdown-preview-pane) {
  line-height: 1.65;
}

:deep(.markdown-preview-pane > div > *:first-child) {
  margin-top: 0;
}

:deep(.markdown-preview-pane > div > *:last-child) {
  margin-bottom: 0;
}

:deep(.markdown-preview-pane table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

:deep(.markdown-preview-pane th),
:deep(.markdown-preview-pane td) {
  padding: 10px 12px;
  border: 1px solid #cfd6e2;
  text-align: left;
}

:deep(.markdown-preview-pane th) {
  font-weight: 600;
  background: rgb(248 250 252);
}

:deep(.markdown-preview-pane code) {
  padding: 2px 5px;
  border-radius: 4px;
  background: rgb(241 245 249);
}

:deep(.markdown-preview-pane pre) {
  padding: 14px;
  border-radius: 6px;
  overflow: auto;
  background: rgb(15 23 42);
}

:deep(.markdown-preview-pane pre code) {
  padding: 0;
  color: rgb(226 232 240);
  background: transparent;
}

@media (max-width: 900px) {
  .markdown-preview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
