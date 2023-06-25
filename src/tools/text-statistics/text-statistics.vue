<script setup lang="ts">
import { getStringSizeInBytes } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const text = ref('');
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline placeholder="Your text..." rows="5" />

    <div mt-5 flex>
      <n-statistic label="Character count" :value="text.length" flex-1 />
      <n-statistic label="Word count" :value="text === '' ? 0 : text.split(/\s+/).length" flex-1 />
      <n-statistic label="Line count" :value="text === '' ? 0 : text.split(/\r\n|\r|\n/).length" flex-1 />
      <n-statistic label="Byte size" :value="formatBytes(getStringSizeInBytes(text))" flex-1 />
    </div>
  </c-card>
</template>
