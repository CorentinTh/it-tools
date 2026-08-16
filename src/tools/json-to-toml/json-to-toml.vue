<script setup lang="ts">
import { createJsonConverterWorkerClient } from './json-converter.worker-client';
import BoundedTextTransformer from '@/components/BoundedTextTransformer.vue';
</script>

<template>
  <BoundedTextTransformer
    conversion="json-to-toml"
    :create-client="createJsonConverterWorkerClient"
    download-filename="converted.toml"
    input-label="Your JSON"
    input-placeholder="Paste your JSON here..."
    output-label="TOML from your JSON"
    output-language="toml"
    task-label="JSON to TOML conversion"
  />
</template>
