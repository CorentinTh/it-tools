<script setup lang="ts">
import Editor from './editor/editor.vue';
import { useHtmlFormatting } from './useHtmlFormatting';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const html = ref('<h1>Hey!</h1><p>Welcome to this html wysiwyg editor</p>');
const {
  cancelFormatting,
  formatNow,
  formattedHtml,
  isFormatting,
  status,
  statusMessage,
} = useHtmlFormatting(html);
const statusIsError = computed(() => status.value === 'error' || status.value === 'limit');
</script>

<template>
  <div class="c-tool-workbench c-task-layout">
    <Editor v-model:html="html" data-test-id="wysiwyg-editor" />

    <div class="c-task-actions">
      <c-button
        type="primary"
        data-test-id="wysiwyg-format"
        :disabled="isFormatting || !html || status === 'limit'"
        @click="formatNow"
      >
        {{ status === 'formatting' ? 'Formatting…' : 'Format HTML' }}
      </c-button>
      <c-button
        v-if="status === 'formatting'"
        type="warning"
        data-test-id="wysiwyg-cancel"
        @click="cancelFormatting"
      >
        Cancel
      </c-button>
    </div>

    <p
      class="c-task-status"
      data-test-id="wysiwyg-status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      text-sm
      :class="{ 'status-error': statusIsError }"
    >
      {{ statusMessage }}
    </p>

    <section v-if="formattedHtml" class="c-task-results" data-test-id="wysiwyg-result">
      <h2 mb-3 text-lg font-600>
        Formatted HTML
      </h2>
      <TextareaCopyable :value="formattedHtml" language="html" />
    </section>
  </div>
</template>

<style scoped lang="less">
.status-error {
  color: var(--n-feedback-text-color-error, #d03050);
}
</style>
