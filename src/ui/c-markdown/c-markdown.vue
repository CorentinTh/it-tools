<script setup lang="ts">
import DomPurify from 'dompurify';
import { marked } from 'marked';

const props = withDefaults(defineProps<{ markdown?: string }>(), { markdown: '' });
const { markdown } = toRefs(props);

marked.use({
  renderer: {
    link({ href, tokens }) {
      const text = this.parser.parseInline(tokens);
      return `<a class="text-primary transition decoration-none hover:underline" href="${href}" target="_blank" rel="noopener">${text}</a>`;
    },
  },
});

const html = computed(() => DomPurify.sanitize(marked.parse(markdown.value, { async: false }), { ADD_ATTR: ['target'] }));
</script>

<template>
  <div v-html="html" />
</template>
