<script setup lang="ts">
import { getTextStatistics } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const text = ref('');
const statistics = computed(() => getTextStatistics(text.value));
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card title="Input">
      <c-input-text v-model:value="text" label="Text to analyze" placeholder="Your text..." rows="8" raw-text multiline />
    </c-card>

    <c-card title="Statistics">
      <dl class="statistics-grid">
        <div
          v-for="item in [
            { label: 'Character count', value: statistics.characterCount },
            { label: 'Word count', value: statistics.wordCount },
            { label: 'Line count', value: statistics.lineCount },
            { label: 'Byte size', value: formatBytes(statistics.byteSize) },
          ]" :key="item.label" class="statistic"
        >
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>
    </c-card>
  </div>
</template>

<style scoped>
.statistics-grid {
  display: grid;
  margin: 0;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
  gap: var(--ui-space-3);
}

.statistic {
  padding: var(--ui-space-3);
  text-align: center;
}

.statistic dt {
  opacity: 0.7;
}

.statistic dd {
  margin: var(--ui-space-1) 0 0;
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
