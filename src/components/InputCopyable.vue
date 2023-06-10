<script setup lang="ts">
import { useClipboard, useVModel } from '@vueuse/core';

const props = defineProps<{ value: string }>();
const emit = defineEmits(['update:value']);

const value = useVModel(props, 'value', emit);
const tooltipText = ref('Copy to clipboard');

const { copy } = useClipboard({ source: value });

function onCopyClicked() {
  copy();
  tooltipText.value = 'Copied !';

  setTimeout(() => {
    tooltipText.value = 'Copy to clipboard';
  }, 2000);
}
</script>

<template>
  <c-input-text v-model:value="value">
    <template #suffix>
      <n-tooltip trigger="hover">
        <template #trigger>
          <c-button circle variant="text" size="small" @click="onCopyClicked">
            <icon-mdi-content-copy />
          </c-button>
        </template>
        {{ tooltipText }}
      </n-tooltip>
    </template>
  </c-input-text>
</template>
