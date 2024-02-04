<script setup lang="ts">
import { formatXml, isValidXML } from './xml-formatter.service';
import type { UseValidationRule } from '@/composable/validation';

const defaultValue = '<hello><world>it-tools</world><world>haokudelei</world></hello>';
const indentSize = useStorage('xml-formatter:indent-size', 2);
const collapseContent = useStorage('xml-formatter:collapse-content', true);

function transformer(value: string) {
  return formatXml(value, {
    indentation: ' '.repeat(indentSize.value),
    collapseContent: collapseContent.value,
    lineSeparator: '\n',
  });
}

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidXML,
    message: '无效的XML',
  },
];
</script>

<template>
  <div important:flex-full important:flex-shrink-0 important:flex-grow-0>
    <div flex justify-center gap-3>
      <n-form-item label="折叠内容:" label-placement="left">
        <n-switch v-model:value="collapseContent" />
      </n-form-item>
      <n-form-item label="缩进:" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="0" max="10" w-100px />
      </n-form-item>
    </div>
  </div>

  <format-transformer
    input-label="XML"
    input-placeholder="请输入XML"
    output-label="已格式化的XML"
    output-language="xml"
    :input-validation-rules="rules"
    :transformer="transformer"
    :input-default="defaultValue"
  />
</template>
