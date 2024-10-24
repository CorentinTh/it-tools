<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { useCopy } from '@/composable/copy';
import { translate as t } from '@/plugins/i18n.plugin';

const props = defineProps<{ value: string }>();
const emit = defineEmits(['update:value']);

const value = useVModel(props, 'value', emit);
const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const tooltipText = computed(() => isJustCopied.value ? t('inputCopyable.copied') : t('inputCopyable.copy'));
</script>

<template>
  <c-input-text v-model:value="value">
    <template #suffix>
      <c-tooltip :tooltip="tooltipText">
        <c-button circle variant="text" size="small" @click="copy()">
          <icon-mdi-content-copy />
        </c-button>
      </c-tooltip>
    </template>
  </c-input-text>
</template>
