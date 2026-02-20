<script setup lang="ts">
import { getStringSizeInBytes } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const text = ref('');
const { t } = useI18n();
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline :placeholder="t('tools.text-statistics.placeholder')" rows="5" />

    <div mt-5 flex>
      <n-statistic :label="t('tools.text-statistics.characters')" :value="text.length" flex-1 />
      <n-statistic :label="t('tools.text-statistics.words')" :value="text === '' ? 0 : text.split(/\s+/).length" flex-1 />
      <n-statistic :label="t('tools.text-statistics.lines')" :value="text === '' ? 0 : text.split(/\r\n|\r|\n/).length" flex-1 />
      <n-statistic :label="t('tools.text-statistics.bytes')" :value="formatBytes(getStringSizeInBytes(text))" flex-1 />
    </div>
  </c-card>
</template>
