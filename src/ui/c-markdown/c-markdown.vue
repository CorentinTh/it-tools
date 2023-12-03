<script setup lang="ts">
import { marked } from 'marked';
import DomPurify from 'dompurify';
import highlight from "highlight.js";
import 'highlight.js/styles/atom-one-dark.css';

const props = withDefaults(defineProps<{ markdown?: string }>(), { markdown: '' });
const { markdown } = toRefs(props);

marked.use({
  renderer: {
    link(href, title, text) {
      return `<a class="text-primary transition decoration-none hover:underline" href="${href}" target="_blank" rel="noopener">${text}</a>`;
    },

    code(code: string, infoString: string = '') {
      const validLanguage = highlight.getLanguage(infoString) ? infoString : 'plaintext'
      const highlightedCode = highlight.highlight(validLanguage, code).value;
      return `<pre><code class="hljs ${validLanguage}">${highlightedCode}</code></pre>`;
    }
  },
});

const html = computed(() => DomPurify.sanitize(marked(markdown.value), { ADD_ATTR: ['target'] }));
</script>

<template>
  <div v-html="html" />
</template>
