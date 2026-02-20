<script setup lang="ts">
import { spamCauseDecode } from './x-vr-spamcause-decoder.service';

const encodedXVRSpamCause = ref('');
const decoded = computed(() => spamCauseDecode(encodedXVRSpamCause.value));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="encodedXVRSpamCause"
      label="Encoded X-VR-SPAMCAUSE:"
      multiline
      rows="1"
      autosize
      placeholder="Your X-VR-SPAMCAUSE header value..."
      mb-6
    />

    <n-divider />

    <textarea-copyable readonly label="Decoded" :value="decoded" />
  </div>
</template>
