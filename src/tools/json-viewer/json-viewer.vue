<script setup lang="ts">
import JSON5 from 'json5';
import { useStorage } from '@vueuse/core';
import { formatJson } from './json.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputElement = ref<HTMLElement>();

const rawJson = useStorage('json-prettify:raw-json', '{"hello": "world", "foo": "bar"}');
const indentSize = useStorage('json-prettify:indent-size', 3);
const sortKeys = useStorage('json-prettify:sort-keys', true);
const autoUnescape = useStorage('json-prettify:auto-unescape', false);
const cleanJson = computed(() => withDefaultOnError(() => formatJson({ rawJson, indentSize, sortKeys, autoUnescape }), ''));

const rawJsonValidation = useValidation({
  source: rawJson,
  rules: [
    {
      validator: (v: string) => {
        if (v === '') {
          return true;
        }
        try {
          let jsonString = v;
          if (autoUnescape.value) {
            // Apply the same unescaping logic for validation
            jsonString = jsonString.trim();

            if ((jsonString.startsWith('"') && jsonString.endsWith('"'))
                || (jsonString.startsWith('\'') && jsonString.endsWith('\''))) {
              jsonString = jsonString.slice(1, -1);
            }

            jsonString = jsonString
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, '\\')
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '\r')
              .replace(/\\t/g, '\t')
              .replace(/\\f/g, '\f')
              .replace(/\\b/g, '\b')
              .replace(/\\\//g, '/');
          }
          JSON5.parse(jsonString);
          return true;
        }
        catch {
          return false;
        }
      },
      message: 'Provided JSON is not valid.',
    },
  ],
  watch: [autoUnescape],
});
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 700px" flex flex-wrap justify-center gap-3>
      <n-form-item label="Sort keys :" label-placement="left" label-width="100">
        <n-switch v-model:value="sortKeys" />
      </n-form-item>
      <n-form-item label="Auto-unescape :" label-placement="left" label-width="130">
        <n-switch v-model:value="autoUnescape" />
      </n-form-item>
      <n-form-item label="Indent size :" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="0" max="10" style="width: 100px" />
      </n-form-item>
    </div>
  </div>

  <n-form-item
    label="Your raw JSON"
    :feedback="rawJsonValidation.message"
    :validation-status="rawJsonValidation.status"
  >
    <c-input-text
      ref="inputElement"
      v-model:value="rawJson"
      placeholder="Paste your raw JSON here... Enable 'Auto-unescape' for escaped JSON strings"
      rows="20"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
      test-id="json-prettify-input"
    />
  </n-form-item>
  <n-form-item label="Prettified version of your JSON">
    <TextareaCopyable :value="cleanJson" language="json" :follow-height-of="inputElement" />
  </n-form-item>
</template>

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
