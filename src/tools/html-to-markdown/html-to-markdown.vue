<script setup lang="ts">
import TurndownService from 'turndown';
import { gfm as addGFM } from '@guyplusplus/turndown-plugin-gfm';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const turndownService = new TurndownService();
addGFM(turndownService);

const inputHtml = ref('');
const outputMarkdown = computed(() => {
  try {
    return turndownService.turndown(inputHtml.value ?? '');
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputHtml"
      multiline raw-text
      placeholder="Your Html content..."
      rows="8"
      autofocus
      label="Your Html to convert (can paste from clipboard):"
      paste-html
    />

    <n-divider />

    <n-form-item label="Output markdown:">
      <TextareaCopyable :value="outputMarkdown" />
    </n-form-item>
  </div>
</template>
