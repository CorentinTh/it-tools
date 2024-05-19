<script setup lang="ts">
import JSON5 from 'json5';
import json2csharp from 'json2csharp';
import type { UseValidationRule } from '@/composable/validation';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = `{
  a:"n",
  arr: [1, 2], 
  nested: {
    a:1,
    b:"2"
  }
}`;
const jsonInput = ref(defaultValue);
const useNewtonsoft = useStorage('json-to-csharp:newtonsoft', false);
const csharpOutput = computed(() => withDefaultOnError(
  () => json2csharp(JSON.stringify(JSON5.parse(jsonInput.value)), useNewtonsoft.value), ''));
const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <c-card title="JSON to C#">
    <c-input-text
      v-model:value="jsonInput"
      multiline
      placeholder="Put your json string here..."
      rows="20"
      label="JSON to C#"
      :validation-rules="rules"
      raw-text
      mb-5
    />
    <n-checkbox v-model:checked="useNewtonsoft">
      <span title="Use Newtonsoft Annotations">Use Newtonsoft Annotations</span>
    </n-checkbox>
  </c-card>
  <c-card title="Your C# code">
    <TextareaCopyable
      :value="csharpOutput"
      language="csharp"
    />
  </c-card>
</template>
