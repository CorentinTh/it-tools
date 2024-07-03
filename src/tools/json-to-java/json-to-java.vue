<script setup lang="ts">
import JSON5 from 'json5';
import { convert } from './json-to-java.service';
import type { UseValidationRule } from '@/composable/validation';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const jsonInput = ref('');
const clazzInput = ref('Result');
const goOutput = computed(() => {
  return jsonInput.value ? convert(clazzInput.value, jsonInput.value) : '';
});

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <c-card title="JSON to Java Entity">
    <c-input-text
      v-model:value="clazzInput"
      placeholder="Custom class name"
      raw-text
      label="classname"
      label-position="left"
      label-width="50px"
      mb-2
    />
    <c-input-text
      v-model:value="jsonInput"
      multiline
      placeholder="Put your josn string here..."
      rows="20"
      label="JSON to Java"
      :validation-rules="rules"
      raw-text
      mb-5
    />
  </c-card>
  <c-card title="You Java String">
    <TextareaCopyable
      :value="goOutput"
      language="json"
    />
  </c-card>
</template>
