<script setup lang="ts">
import { createYamlConverterWorkerClient } from './yaml-converter.worker-client';
import BoundedTextTransformer from '@/components/BoundedTextTransformer.vue';
</script>

<template>
  <BoundedTextTransformer
    conversion="yaml-to-toml"
    :create-client="createYamlConverterWorkerClient"
    download-filename="converted.toml"
    input-label="Your YAML"
    input-placeholder="Paste your YAML here..."
    output-label="TOML from your YAML"
    output-language="toml"
    task-label="YAML to TOML conversion"
  />
</template>
