<script setup lang="ts">
import markdownit from 'markdown-it';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputMarkdown = ref('');
const outputHtml = computed(() => {
  const md = markdownit();
  return md.render(inputMarkdown.value);
});

function printHtml() {
  const w = window.open();
  if (w === null) {
    return;
  }
  w.document.body.innerHTML = outputHtml.value;
  w.print();
}
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-input-text
      v-model:value="inputMarkdown"
      multiline raw-text
      placeholder="Your Markdown content..."
      rows="8"
      autofocus
      label="Your Markdown to convert:"
    />

    <c-field class="c-tool-panel" label="Output HTML">
      <TextareaCopyable :value="outputHtml" :word-wrap="true" language="html" />
    </c-field>

    <div class="c-generator-actions">
      <c-button @click="printHtml">
        Print as PDF
      </c-button>
    </div>
  </div>
</template>
