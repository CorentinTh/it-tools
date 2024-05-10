<script setup lang="ts">
import beautify from 'js-beautify';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputCSS = ref('');
const outputCSS = computed(() => {
  return beautify.css(inputCSS.value, {
    indent_char: ' ',
    indent_size: 2,
    eol: '\n',
  });
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputCSS"
      multiline raw-text
      placeholder="Your CSS content..."
      rows="8"
      autofocus
      label="Your CSS to format (can paste from clipboard):"
    />

    <n-divider />

    <n-form-item label="Output prettified CSS:">
      <TextareaCopyable
        :value="outputCSS"
        multiline
        language="css"
        word-wrap
      />
    </n-form-item>
  </div>
</template>
