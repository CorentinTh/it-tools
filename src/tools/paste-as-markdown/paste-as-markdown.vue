<script setup lang="ts">
import { subscribe } from '@github/paste-markdown';

const inputElement = ref<HTMLElement>();
const markdown = ref('');

// Subscribe the behavior to the textarea.
onMounted(() => {
  subscribe(inputElement.value as never);
});
</script>

<template>
  <c-card title="Paste in Markdown" class="paste-zone">
    <textarea
      ref="inputElement"
      rows="10"
    />
  </c-card>
</template>
