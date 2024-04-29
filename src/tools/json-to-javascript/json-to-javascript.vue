<script setup lang="ts">
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const indentSize = useStorage('json-prettify:indent-size', 3);
const transformer = (value: string) => withDefaultOnError(() => JSON5.stringify(JSON.parse(value), null, indentSize.value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => JSON5.stringify(JSON.parse(value))),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px" flex justify-center gap-3>
      <n-form-item label="Indent size :" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="0" max="10" style="width: 100px" />
      </n-form-item>
    </div>
  </div>

  <format-transformer
    input-label="Your JSON"
    input-placeholder="Paste your JSON here..."
    output-label="JavaScript Object from your JSON"
    output-language="javascript"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
