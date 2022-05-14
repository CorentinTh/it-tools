<template>
  <n-card>
    <n-form-item
      label="Your raw json:"
      :feedback="rawJsonValidation.message"
      :validation-status="rawJsonValidation.status"
    >
      <n-input
        v-model:value="rawJson"
        class="json-input"
        type="textarea"
        placeholder="Paste your raw json here..."
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </n-form-item>

    <n-space justify="center">
      <n-button secondary @click="rawJson = ''">Clear</n-button>
    </n-space>
  </n-card>

  <n-card v-if="cleanJson.length > 0">
    <n-scrollbar :x-scrollable="true">
      <n-config-provider :hljs="hljs">
        <n-code :code="cleanJson" language="json" />
      </n-config-provider>
    </n-scrollbar>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import { useValidation } from '@/composable/validation';

hljs.registerLanguage('json', json);

const rawJson = ref('');
const cleanJson = computed(() => {
  try {
    return JSON.stringify(JSON.parse(rawJson.value), null, 3);
  } catch (_) {
    return '';
  }
});

const rawJsonValidation = useValidation({
  source: rawJson,
  rules: [
    {
      validator: (v) => v === '' || JSON.parse(v),
      message: 'Invalid json string',
    },
  ],
});
</script>

<style lang="less" scoped>
.json-input ::v-deep(.n-input-wrapper) {
  resize: both !important;
}
</style>
