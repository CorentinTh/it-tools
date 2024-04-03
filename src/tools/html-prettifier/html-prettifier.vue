<script setup lang="ts">
import beautify from 'js-beautify';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputHtml = ref('');
const outputHtml = computed(() => {
  return beautify.html(inputHtml.value, {
    unformatted: ['code', 'pre', 'em', 'strong', 'span'],
    indent_inner_html: true,
    indent_char: ' ',
    indent_size: 2,
    sep: '\n',
  });
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputHtml"
      multiline raw-text
      placeholder="Your HTML content..."
      rows="8"
      autofocus
      label="Your HTML to format (can paste from clipboard):"
      paste-html
    />

    <n-divider />

    <n-form-item label="Output prettified HTML:">
      <TextareaCopyable
        :value="outputHtml"
        multiline
        language="html"
        :word-wrap="true"
      />
    </n-form-item>
  </div>
</template>
