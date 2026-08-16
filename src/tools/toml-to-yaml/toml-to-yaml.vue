<script setup lang="ts">
import { createTomlConverterWorkerClient } from '../toml-to-json/toml-converter.worker-client';
import BoundedTextTransformer from '@/components/BoundedTextTransformer.vue';
</script>

<template>
  <BoundedTextTransformer
    conversion="toml-to-yaml"
    :create-client="createTomlConverterWorkerClient"
    download-filename="converted.yaml"
    input-label="Your TOML"
    input-placeholder="Paste your TOML here..."
    output-label="YAML from your TOML"
    output-language="yaml"
    task-label="TOML to YAML conversion"
  />
</template>
