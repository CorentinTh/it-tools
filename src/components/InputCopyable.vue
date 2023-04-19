<template>
  <n-input v-model:value="value">
    <template #suffix>
      <n-tooltip trigger="hover">
        <template #trigger>
          <c-button circle variant="text" @click="onCopyClicked">
            <n-icon :component="ContentCopyFilled" />
          </c-button>
        </template>
        {{ tooltipText }}
      </n-tooltip>
    </template>
  </n-input>
</template>

<script setup lang="ts">
import { useVModel, useClipboard } from '@vueuse/core';
import { ContentCopyFilled } from '@vicons/material';
import { ref } from 'vue';

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

<style scoped>
::v-deep(.n-input-wrapper) {
  padding-right: 5px;
}
</style>
