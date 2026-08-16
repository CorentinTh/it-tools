<script setup lang="ts">
import { createXmlDataConverterWorkerClient } from './xml-data-converter.worker-client';
import BoundedTextTransformer from '@/components/BoundedTextTransformer.vue';

const defaultValue = '<a x="1.234" y="It\'s"/>';
</script>

<template>
  <BoundedTextTransformer
    conversion="xml-to-json"
    :create-client="createXmlDataConverterWorkerClient"
    download-filename="converted.json"
    :input-default="defaultValue"
    input-label="Your XML content"
    input-placeholder="Paste your XML content here..."
    output-label="Converted JSON"
    output-language="json"
    task-label="XML to JSON conversion"
  />
</template>
