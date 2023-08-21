<script setup lang="ts">
import { useCopy } from '@/composable/copy';

const props = withDefaults(defineProps<{ value?: string }>(), { value: '' });
const { value } = toRefs(props);

const initialText = 'Copy to clipboard';

const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const tooltipText = computed(() => isJustCopied.value ? 'Copied!' : initialText);
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <span class="value" @click="copy()">{{ value }}</span>
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
