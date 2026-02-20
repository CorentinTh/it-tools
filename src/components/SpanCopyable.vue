<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { translate as t } from '@/plugins/i18n.plugin';

const props = withDefaults(defineProps<{ value?: string }>(), { value: '' });
const { value } = toRefs(props);

const initialText = t('spanCopyable.copy');

const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const tooltipText = computed(() => isJustCopied.value ? t('spanCopyable.copied') : initialText);
</script>

<template>
  <c-tooltip :tooltip="tooltipText">
    <span cursor-pointer font-mono @click="copy()">{{ value }}</span>
  </c-tooltip>
</template>
