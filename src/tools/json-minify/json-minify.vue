<script setup lang="ts">
import { createJsonConverterWorkerClient } from '@/tools/json-to-toml/json-converter.worker-client';

const defaultValue = '{\n\t"hello": [\n\t\t"world"\n\t]\n}';
</script>

<template>
  <BoundedTextTransformer
    conversion="json-minify"
    :create-client="createJsonConverterWorkerClient"
    download-filename="minified.json"
    input-label="Your raw JSON"
    :input-default="defaultValue"
    input-placeholder="Paste your raw JSON here..."
    output-label="Minified version of your JSON"
    output-language="json"
    task-label="JSON minification"
  />
</template>
