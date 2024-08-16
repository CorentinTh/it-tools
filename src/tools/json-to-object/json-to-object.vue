<script setup lang="ts">
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import stringifyObject from "stringify-object"

const transformer = (value: string) => withDefaultOnError(() => stringifyObject(JSON5.parse(value), {
	indent: '  ',
	singleQuotes: false
}), '');


const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => stringifyObject(JSON5.parse(value))),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your JSON"
    input-placeholder="Paste your JSON here..."
    output-label="Object from your JSON"
    output-language="js"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>