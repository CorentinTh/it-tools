<script setup lang="ts">
import { getTextStatistics } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const text = ref('');
const statistics = computed(() => getTextStatistics(text.value));
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline placeholder="Your text..." rows="5" />

    <div mt-5 flex>
      <n-statistic label="Character count" :value="statistics.characterCount" flex-1 />
      <n-statistic label="Word count" :value="statistics.wordCount" flex-1 />
      <n-statistic label="Line count" :value="statistics.lineCount" flex-1 />
      <n-statistic label="Byte size" :value="formatBytes(statistics.byteSize)" flex-1 />
    </div>
  </c-card>
</template>
