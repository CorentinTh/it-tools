<script setup lang="ts">
import { createXmlDataConverterWorkerClient } from '../xml-to-json/xml-data-converter.worker-client';
import BoundedTextTransformer from '@/components/BoundedTextTransformer.vue';

const defaultValue = '{"a":{"_attributes":{"x":"1.234","y":"It\'s"}}}';
</script>

<template>
  <BoundedTextTransformer
    conversion="json-to-xml"
    :create-client="createXmlDataConverterWorkerClient"
    download-filename="converted.xml"
    :input-default="defaultValue"
    input-label="Your JSON content"
    input-placeholder="Paste your JSON content here..."
    output-label="Converted XML"
    output-language="xml"
    task-label="JSON to XML conversion"
  />
</template>
