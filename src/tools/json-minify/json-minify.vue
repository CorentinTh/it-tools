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
  <n-form-item label="Minify version of your JSON">
    <textarea-copyable :value="cleanJson" language="json" :follow-height-of="inputElement" />
  </n-form-item>
</template>

<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import JSON5 from 'json5';
import { computed, ref } from 'vue';

const inputElement = ref<HTMLElement>();

const rawJson = ref('{\n\t"hello": [\n\t\t"world"\n\t]\n}');
const cleanJson = computed(() => withDefaultOnError(() => JSON.stringify(JSON5.parse(rawJson.value), null, 0), ''));

const rawJsonValidation = useValidation({
  source: rawJson,
  rules: [
    {
      validator: (v) => v === '' || JSON5.parse(v),
      message: 'Provided JSON is not valid.',
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
