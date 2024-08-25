<script setup lang="ts">
import { formatMsDuration } from '../eta-calculator/eta-calculator.service';
import { getStringSizeInBytes, textStatistics } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const text = ref('');
const stats = computed(() => textStatistics(text.value));
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline placeholder="Your text..." rows="5" />

    <n-space mt-3>
      <n-statistic label="Character count" :value="stats.chars" />
      <n-statistic label="Word count" :value="stats.words" />
      <n-statistic label="Sentences count" :value="stats.sentences" />
      <n-statistic label="Line count" :value="stats.lines" />
      <n-statistic label="Byte size" :value="formatBytes(getStringSizeInBytes(text))" />
    </n-space>

    <n-divider />

    <n-space mt-3>
      <n-statistic label="Unique Word count" :value="stats.words_uniques" />
      <n-statistic label="Unique Word count (case insensitive)" :value="stats.words_uniques_ci" />
      <n-statistic label="Read Time" :value="formatMsDuration(stats.read_time * 1000)" />
    </n-space>

    <n-divider />

    <n-space>
      <n-statistic label="Chars (no spaces)" :value="stats.chars_no_spaces" />
      <n-statistic label="Uppercase chars" :value="stats.chars_upper" />
      <n-statistic label="Lowercase chars" :value="stats.chars_lower" />
      <n-statistic label="Digit chars" :value="stats.chars_digits" />
      <n-statistic label="Punctuations" :value="stats.chars_puncts" />
      <n-statistic label="Spaces chars" :value="stats.chars_spaces" />
      <n-statistic label="Word count (no punct)" :value="stats.words_no_puncs" />
    </n-space>
  </c-card>
</template>
