<template>
  <c-card>
    <n-input v-model:value="text" type="textarea" placeholder="Your text..." rows="5" />

    <div mt-5 flex>
      <n-statistic label="Character count" :value="text.length" flex-1 />
      <n-statistic label="Word count" :value="text === '' ? 0 : text.split(/\s+/).length" flex-1 />
      <n-statistic label="Line count" :value="text === '' ? 0 : text.split(/\r\n|\r|\n/).length" flex-1 />
      <n-statistic label="Byte size" :value="formatBytes(getStringSizeInBytes(text))" flex-1 />
    </div>
  </c-card>
</template>

<script setup lang="ts">
import { formatBytes } from '@/utils/convert';
import { ref } from 'vue';
import { getStringSizeInBytes } from './text-statistics.service';

const text = ref('');
</script>
