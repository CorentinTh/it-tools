<script setup lang="ts">
import { getStringSizeInBytes } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const { t } = useI18n();
const text = ref('');
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline :placeholder="t('tools.text-statistics.inputPlaceholder')" rows="5" />

    <div mt-5 flex>
      <n-statistic :label="t('tools.text-statistics.characterCount')" :value="text.length" flex-1 />
      <n-statistic :label="t('tools.text-statistics.wordCount')" :value="text === '' ? 0 : text.split(/\s+/).length" flex-1 />
      <n-statistic :label="t('tools.text-statistics.lineCount')" :value="text === '' ? 0 : text.split(/\r\n|\r|\n/).length" flex-1 />
      <n-statistic :label="t('tools.text-statistics.byteSize')" :value="formatBytes(getStringSizeInBytes(text))" flex-1 />
    </div>
  </c-card>
</template>
