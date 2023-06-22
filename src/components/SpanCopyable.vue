<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

const props = withDefaults(defineProps<{ value?: string }>(), { value: '' });
const { value } = toRefs(props);

const initialText = 'Copy to clipboard';
const tooltipText = ref(initialText);

const { copy } = useClipboard({ source: value });

function handleClick() {
  copy();
  tooltipText.value = 'Copied!';

  setTimeout(() => (tooltipText.value = initialText), 1000);
}
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <span class="value" @click="handleClick">{{ value }}</span>
    </template>
    {{ tooltipText }}
  </n-tooltip>
</template>

<style scoped lang="less">
.value {
  cursor: pointer;
  font-family: monospace;
}
</style>
