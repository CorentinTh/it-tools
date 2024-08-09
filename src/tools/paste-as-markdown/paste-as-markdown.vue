<script setup lang="ts">
import { subscribe } from '@github/paste-markdown';

// Subscribe the behavior to the textarea.
subscribe(document.querySelector('.paste-zone textarea') as never);
</script>

<template>
  <c-card title="Paste in Markdown" class="paste-zone">
    <textarea-copyable language="markdown" />
  </c-card>
</template>
