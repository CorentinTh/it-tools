<script setup lang="ts">
import { subscribe } from '@github/paste-markdown';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

const inputElement = ref<typeof CInputText>();
const markdown = ref('');

// Subscribe the behavior to the textarea.
onMounted(() => {
  subscribe(inputElement.value?.textareaRef as never);
});
</script>

<template>
  <c-card title="Paste in Markdown" class="paste-zone">
    <n-ul>
      <n-li>Paste spreadsheet cells and HTML tables as a Markdown tables.</n-li>
      <n-li>Paste URLs on selected text as Markdown links.</n-li>
      <n-li>Paste text containing links as text containing Markdown links.</n-li>
      <n-li>Paste image URLs as Markdown image links.</n-li>
    </n-ul>
    <CInputText
      ref="inputElement"
      v-model:value="markdown"
      multiline
      placeholder="Paste your content here..."
      rows="10"
      w-full
    />
  </c-card>
</template>
