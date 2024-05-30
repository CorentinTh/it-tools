<script setup lang="ts">
import JSON5 from 'json5';
import { jsonToGo } from './json-to-go.service';
import type { UseValidationRule } from '@/composable/validation';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const definitions = ref(true);
const omitempty = ref(false);
const example = ref(false);
const jsonInput = ref('');
const goOutput = computed(() => jsonToGo(jsonInput.value, '', !definitions.value, example.value, omitempty.value).go);
const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <c-card title="JSON to Go">
    <n-form-item label="Inline type definitions" label-placement="left">
      <n-switch v-model:value="definitions" />
    </n-form-item>
    <n-form-item label="Omit Empty" label-placement="left">
      <n-switch v-model:value="omitempty" />
    </n-form-item>
    <n-form-item label="Example" label-placement="left">
      <n-switch v-model:value="example" />
    </n-form-item>
    <c-input-text
      v-model:value="jsonInput"
      multiline
      placeholder="Put your json string here..."
      rows="20"
      label="JSON to GO"
      :validation-rules="rules"
      raw-text
      mb-5
    />
  </c-card>
  <c-card title="Your Go String">
    <TextareaCopyable
      :value="goOutput"
      language="go"
    />
  </c-card>
</template>
