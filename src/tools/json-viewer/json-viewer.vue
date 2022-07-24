<template>
  <n-form-item
    label="Your raw json"
    :feedback="rawJsonValidation.message"
    :validation-status="rawJsonValidation.status"
  >
    <n-input
      ref="inputElement"
      v-model:value="rawJson"
      placeholder="Paste your raw json here..."
      type="textarea"
      rows="20"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />
  </n-form-item>
  <n-form-item label="Prettify version of your json">
    <n-card class="result-card" :style="`min-height: ${inputElementHeight ?? 400}px`">
      <n-config-provider :hljs="hljs">
        <n-code :code="cleanJson" language="json" :trim="false" />
      </n-config-provider>
      <n-button v-if="cleanJson" class="copy-button" secondary @click="copy">Copy</n-button>
    </n-card>
  </n-form-item>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { useElementSize } from '@vueuse/core';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import { computed, ref } from 'vue';

hljs.registerLanguage('json', json);
const inputElement = ref<HTMLElement>();
const { height: inputElementHeight } = useElementSize(inputElement);

const rawJson = ref('{"hello": "world"}');
const cleanJson = computed(() => {
  try {
    return JSON.stringify(JSON.parse(rawJson.value), null, 3);
  } catch (_) {
    return '';
  }
});

const { copy } = useCopy({ source: cleanJson });

const rawJsonValidation = useValidation({
  source: rawJson,
  rules: [
    {
      validator: (v) => v === '' || JSON.parse(v),
      message: 'Invalid json',
    },
  ],
});
</script>

<style lang="less" scoped>
.result-card {
  position: relative;
  .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
