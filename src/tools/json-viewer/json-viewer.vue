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
    <textarea-copyable :value="cleanJson" language="json" :follow-height-of="inputElement" />
  </n-form-item>
</template>

<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';
import { computed, ref } from 'vue';

const inputElement = ref<HTMLElement>();

const rawJson = ref('{"hello": "world"}');
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
