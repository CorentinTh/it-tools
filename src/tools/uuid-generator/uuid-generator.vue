<template>
  <n-space vertical :size="20">
    <n-space align="center" justify="center">
      Quantity :
      <n-input-number v-model:value="count" :min="1" :max="50" placeholder="UUID quantity" />
    </n-space>

    <n-input
      style="text-align: center; font-family: monospace"
      :value="uuids"
      type="textarea"
      placeholder="Your uuids"
      :autosize="{ minRows: 1 }"
      readonly
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />

    <n-space justify="center">
      <c-button autofocus @click="copy"> Copy </c-button>
      <c-button @click="refreshUUIDs"> Refresh </c-button>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { v4 as generateUUID } from 'uuid';
import { computedRefreshable } from '@/composable/computedRefreshable';

const count = useStorage('uuid-generator:quantity', 1);

const [uuids, refreshUUIDs] = computedRefreshable(() =>
  Array.from({ length: count.value }, () => generateUUID()).join('\n'),
);

const { copy } = useCopy({ source: uuids, text: 'UUIDs copied to the clipboard' });
</script>
