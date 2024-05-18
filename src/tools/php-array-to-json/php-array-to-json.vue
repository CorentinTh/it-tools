<script setup lang="ts">
import jsonar from 'jsonar-mod';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = `array(
  "a" => "b",
  "arr" => array(
    1,
    "2"
  ),
  "nested" => array(
    "c" => 12,
    "d" => "az"
  )
);`;
function transformer(value: string) {
  return withDefaultOnError(() => JSON.stringify(jsonar.parse(value), null, 2), '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || jsonar.parse(v),
    message: 'Provided PHP Array is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your PHP Array"
    :input-default="defaultValue"
    input-placeholder="Paste your PHP Array here..."
    output-label="JSON version"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
