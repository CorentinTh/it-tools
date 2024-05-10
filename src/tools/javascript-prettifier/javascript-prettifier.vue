<script setup lang="ts">
import beautify from 'js-beautify';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputJS = ref('');
const outputJS = computed(() => {
  return beautify(inputJS.value, {
    indent_char: ' ',
    indent_size: 2,
    eol: '\n',
  });
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputJS"
      multiline raw-text
      placeholder="Your JS content..."
      rows="8"
      autofocus
      label="Your JS to format (can paste from clipboard):"
    />

    <n-divider />

    <n-form-item label="Output prettified JS:">
      <TextareaCopyable
        :value="outputJS"
        multiline
        language="javascript"
        word-wrap
      />
    </n-form-item>
  </div>
</template>
