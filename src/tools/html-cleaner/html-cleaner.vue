<script setup lang="ts">
import DOMPurify from 'dompurify';
import beautify from 'js-beautify';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputHtml = ref('');
const outputHtml = computed(() => {
  const cleanedHtml = DOMPurify.sanitize(inputHtml.value ?? '',
    {
      ALLOWED_ATTR: [
        'href', 'src',
        'width', 'height',
        'alt',
        'colspan', 'rowspan',
      ],
      FORBID_TAGS: ['form', 'span'],
      ALLOW_DATA_ATTR: false,
      ALLOW_ARIA_ATTR: false,
      RETURN_DOM: true,
    }).outerHTML;
  return beautify.html(cleanedHtml, {
    unformatted: ['code', 'pre', 'em', 'strong', 'span'],
    indent_inner_html: true,
    indent_char: ' ',
    indent_size: 2,
    eol: '\n',
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
      label="Your HTML to clean (can paste from clipboard):"
      paste-html
    />

    <n-divider />

    <n-form-item label="Output cleaned HTML:">
      <TextareaCopyable
        :value="outputHtml"
        multiline
        language="html"
        :word-wrap="true"
      />
    </n-form-item>
  </div>
</template>
