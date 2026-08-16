<script setup lang="ts">
import { createTomlConverterWorkerClient } from './toml-converter.worker-client';
import BoundedTextTransformer from '@/components/BoundedTextTransformer.vue';
</script>

<template>
  <BoundedTextTransformer
    conversion="toml-to-json"
    :create-client="createTomlConverterWorkerClient"
    download-filename="converted.json"
    input-label="Your TOML"
    input-placeholder="Paste your TOML here..."
    output-label="JSON from your TOML"
    output-language="json"
    task-label="TOML to JSON conversion"
  />
</template>
