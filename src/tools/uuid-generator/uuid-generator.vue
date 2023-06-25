<script setup lang="ts">
import { v4 as generateUUID } from 'uuid';
import { useCopy } from '@/composable/copy';
import { computedRefreshable } from '@/composable/computedRefreshable';

const count = useStorage('uuid-generator:quantity', 1);

const [uuids, refreshUUIDs] = computedRefreshable(() =>
  Array.from({ length: count.value }, () => generateUUID()).join('\n'),
);

const { copy } = useCopy({ source: uuids, text: 'UUIDs copied to the clipboard' });
</script>

<template>
  <div>
    <div flex items-center justify-center gap-3>
      Quantity :
      <n-input-number v-model:value="count" :min="1" :max="50" placeholder="UUID quantity" />
    </div>

    <c-input-text
      style="text-align: center; font-family: monospace"
      :value="uuids"
      multiline
      placeholder="Your uuids"
      autosize
      rows="1"
      readonly
      raw-text
      monospace
      my-3
      class="uuid-display"
    />

    <div flex justify-center gap-3>
      <c-button autofocus @click="copy">
        Copy
      </c-button>
      <c-button @click="refreshUUIDs">
        Refresh
      </c-button>
    </div>
  </div>
</template>

<style scoped lang="less">
::v-deep(.uuid-display) {
  textarea {
    text-align: center;
  }
}
</style>
