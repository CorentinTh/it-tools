<script setup lang="ts">
import { generatePort } from './random-port-generator.model';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';

const [port, refreshPort] = computedRefreshable(
  () => String(generatePort()),
  { dependencies: [] },
);

const { copy } = useCopy({ source: port, text: 'Port copied to the clipboard' });
</script>

<template>
  <div class="c-generator-layout">
    <c-input-text
      class="c-generator-output"
      :value="port"
      label="Generated port"
      placeholder="Generated port"
      test-id="random-port-output"
      readonly
      raw-text
      monospace
    />

    <div class="c-generator-actions">
      <c-button type="primary" data-test-id="random-port-generate" @click="refreshPort">
        Generate
      </c-button>
      <c-button data-test-id="random-port-copy" @click="copy()">
        Copy
      </c-button>
    </div>
  </div>
</template>
