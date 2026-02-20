<script setup lang="ts">
import markdownit from 'markdown-it';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputMarkdown = ref('');
const outputHtml = computed(() => {
  const md = markdownit();
  return md.render(inputMarkdown.value);
});
const { t } = useI18n();

function printHtml() {
  const w = window.open();
  if (w === null) {
    return;
  }
  w.document.body.innerHTML = outputHtml.value;
  w.print();
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputMarkdown"
      multiline raw-text
      :placeholder="t('tools.markdown-to-html.markdownInput')"
      rows="8"
      autofocus
      :label="t('tools.markdown-to-html.markdown')"
    />

    <n-divider />

    <n-form-item :label="t('tools.markdown-to-html.html')">
      <TextareaCopyable :value="outputHtml" :word-wrap="true" language="html" />
    </n-form-item>

    <div flex justify-center>
      <n-button @click="printHtml">
        {{ t('tools.markdown-to-html.button.print') }}
      </n-button>
    </div>
  </div>
</template>
