<script setup lang="ts">
import { createJsonConverterWorkerClient } from '../json-to-toml/json-converter.worker-client';
import BoundedTextTransformer from '@/components/BoundedTextTransformer.vue';
</script>

<template>
  <BoundedTextTransformer
    conversion="json-to-yaml"
    :create-client="createJsonConverterWorkerClient"
    download-filename="converted.yaml"
    input-label="Your JSON"
    input-placeholder="Paste your JSON here..."
    output-label="YAML from your JSON"
    output-language="yaml"
    task-label="JSON to YAML conversion"
  />
</template>
