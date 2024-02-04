<script setup lang="ts">
import { getStringSizeInBytes } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const text = ref('');
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline placeholder="请输入文本" rows="5" />

    <div mt-5 flex>
      <n-statistic label="字符数" :value="text.length" flex-1 />
      <n-statistic label="单词数" :value="text === '' ? 0 : text.split(/\s+/).length" flex-1 />
      <n-statistic label="行数" :value="text === '' ? 0 : text.split(/\r\n|\r|\n/).length" flex-1 />
      <n-statistic label="字节数" :value="formatBytes(getStringSizeInBytes(text))" flex-1 />
    </div>
  </c-card>
</template>
