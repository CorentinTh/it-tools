<template>
  <span ref="block"></span>
</template>

<script lang="ts" setup>
import sanitizeHtml from 'sanitize-html';
import { Ref, ref, watch } from 'vue';

const block = ref() as Ref<HTMLSpanElement>;

const props = withDefaults(defineProps<{ html: string }>(), { html: undefined });

let options = {
  allowedTags: ['div', 'ul', 'li', 'pre'],
  allowedAttributes: {
    div: ['class'],
    ul: ['class'],
    li: ['class', 'data-key'],
  },
};

const onUpdateContent = () => {
  if (block.value) {
    block.value.innerHTML = sanitizeHtml(props.html, options);
  }
};

onMounted(() => {
  onUpdateContent();
});

watch(
  () => props.html as string | undefined,
  () => {
    onUpdateContent();
  },
  { immediate: true },
);
</script>
