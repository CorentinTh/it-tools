<script setup lang="ts">
import { createYamlConverterWorkerClient } from '../yaml-to-toml/yaml-converter.worker-client';
import BoundedTextTransformer from '@/components/BoundedTextTransformer.vue';
</script>

<template>
  <BoundedTextTransformer
    conversion="yaml-to-json"
    :create-client="createYamlConverterWorkerClient"
    download-filename="converted.json"
    input-label="Your YAML"
    input-placeholder="Paste your YAML here..."
    output-label="JSON from your YAML"
    output-language="json"
    task-label="YAML to JSON conversion"
  />
</template>
