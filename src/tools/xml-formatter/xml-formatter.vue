<script setup lang="ts">
import { formatXml, isValidXML } from './xml-formatter.service';
import type { UseValidationRule } from '@/composable/validation';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';

const defaultValue = '<hello><world>foo</world><world>bar</world></hello>';
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
    message: 'Provided XML is not valid.',
  },
];
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card>
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <CSwitch
          id="xml-collapse-content"
          v-model:value="collapseContent"
          label="Collapse content"
          label-position="top"
        />

        <c-field label="Indent size (0–10)" label-for="xml-indent-size">
          <CInputNumber
            id="xml-indent-size"
            v-model:value="indentSize"
            test-id="xml-indent-size"
            :min="0"
            :max="10"
          />
        </c-field>
      </div>
    </c-card>

    <format-transformer
      input-label="Your XML"
      input-placeholder="Paste your XML here..."
      output-label="Formatted XML from your XML"
      output-language="xml"
      :input-validation-rules="rules"
      :transformer="transformer"
      :input-default="defaultValue"
    />
  </div>
</template>
