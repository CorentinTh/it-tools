<script setup lang="ts">
import { formatXml } from './xml-formatter.service';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = '<hello><world>foo</world><world>bar</world></hello>';
const indentSize = useStorage('xml-formatter:indent-size', 2);
const collapseContent = useStorage('xml-formatter:collapse-content', true);
function transformer(value: string) {
  return withDefaultOnError(() => {
    const def = {
      indentation: ' '.repeat(indentSize.value),
      collapseContent: collapseContent.value,
      lineSeparator: '\n\r',
    };
    return formatXml(value, def);
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => isNotThrowing(() => formatXml(value)),
    message: 'Provided XML is not valid.',
  },
];
</script>

<template>
  <div style="flex: 0 0 100%">
    <n-space style="margin: 0 auto; max-width: 600px" justify="center">
      <n-form-item label="Collapse Content :" label-placement="left" label-width="100">
        <n-switch v-model:value="collapseContent" />
      </n-form-item>
      <n-form-item label="Indent size :" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="0" max="10" style="width: 100px" />
      </n-form-item>
    </n-space>
  </div>

  <format-transformer
    input-label="Your XML"
    input-placeholder="Paste your xml here..."
    output-label="Formatted XML from your XML"
    output-language="xml"
    :input-validation-rules="rules"
    :transformer="transformer"
    :input-default="defaultValue"
  />
</template>
