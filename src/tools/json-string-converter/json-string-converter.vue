<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = '{\n\t"hello": [\n\t\t"world"\n\t]\n}';

// Define a reactive variable to track the selected transformation mode
const selectedMode = ref('stringify');

// Create functions for both stringification and parsing
const stringifyTransformer = (value: string) => withDefaultOnError(() => JSON.stringify(value), '');
const parseTransformer = (value: string) => withDefaultOnError(() => JSON.parse(value).toString(), '');

// Dynamically select the transformer based on the selected mode
const transformer = computed(() => {
  if (selectedMode.value === 'stringify') {
    return stringifyTransformer;
  }
  else {
    return parseTransformer;
  }
});

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || (selectedMode.value === 'stringify' ? JSON.stringify(v) : JSON.parse(v)),
    message: 'Provided text is not valid. (Make sure your JSON is in double quotes)',
  },
];

// Dropdown options
const dropdownOptions = computed(() => [
  { label: 'JSON Stringify', value: 'stringify' },
  { label: 'JSON Parse', value: 'parse' },
]);
</script>

<template>
  <c-card>
    <c-select
      v-model:value="selectedMode"
      label="Transformation Mode"
      :options="dropdownOptions"
    />
  </c-card>
  <div />
  <format-transformer
    input-label="Your text / JSON string"
    :input-default="defaultValue"
    input-placeholder="Paste your text here..."
    output-label="JSON string conversion of your input"
    output-language="string"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
