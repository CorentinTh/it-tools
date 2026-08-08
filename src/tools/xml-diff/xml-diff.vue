<script setup lang="ts">
import DiffsViewer from './diff-viewer/xml-diff-viewer.vue';
import { isValidXML, parseXml } from './xml-diff.parser';

const rawLeftXml = ref('');
const rawRightXml = ref('');

const leftXml = computed(() => parseXml(rawLeftXml.value));
const rightXml = computed(() => parseXml(rawRightXml.value));

const xmlValidationRules = [
  {
    validator: (value: string) => isValidXML(value),
    message: 'Invalid XML format',
  },
];
</script>

<template>
  <c-input-text
    v-model:value="rawLeftXml"
    :validation-rules="xmlValidationRules"
    label="Your first XML"
    placeholder="Paste your first XML here..."
    rows="20"

    test-id="leftXml"

    raw-text multiline monospace
  />

  <c-input-text
    v-model:value="rawRightXml"
    :validation-rules="xmlValidationRules"
    label="Your XML to compare"
    placeholder="Paste your XML to compare here..."
    rows="20"
    multiline
    test-id="rightXml"
    raw-text
    monospace
  />

  <DiffsViewer :left-xml="leftXml" :right-xml="rightXml" />
</template>
