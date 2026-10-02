<script setup lang="ts">
import { extractTextFromHtml } from './html-to-text.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';

const collapseWhitespace = ref(true);
const rawHtml = ref(
  `<article>
  <h1>Release notes</h1>
  <p>The <b>new</b> version is out.</p>
  <ul><li>Faster</li><li>Smaller</li></ul>
</article>`,
);

const extracted = computed(() =>
  withDefaultOnError(() => extractTextFromHtml(rawHtml.value, { collapseWhitespace: collapseWhitespace.value }), ''),
);
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="rawHtml"
      label="Your HTML"
      placeholder="Paste HTML here (e.g. copied outer HTML from DevTools)..."

      rows="8"
      raw-text multiline mb-3
    />

    <n-form-item label="Collapse whitespace" label-placement="left" :show-feedback="false" mb-3>
      <n-switch v-model:value="collapseWhitespace" />
    </n-form-item>

    <n-form-item label="Extracted text:" label-placement="top">
      <TextareaCopyable :value="extracted" copy-placement="outside" mb-1 />
    </n-form-item>
  </c-card>
</template>
