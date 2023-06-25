<script setup lang="ts">
// Duplicate issue with sub directory

import { addMilliseconds, formatRelative } from 'date-fns';

import { enGB } from 'date-fns/locale';

import { formatMsDuration } from './eta-calculator.service';

const unitCount = ref(3 * 62);
const unitPerTimeSpan = ref(3);
const timeSpan = ref(5);
const timeSpanUnitMultiplier = ref(60000);
const startedAt = ref(Date.now());

const durationMs = computed(() => {
  const timeSpanMs = timeSpan.value * timeSpanUnitMultiplier.value;

  return unitCount.value / (unitPerTimeSpan.value / timeSpanMs);
});
const endAt = computed(() =>
  formatRelative(addMilliseconds(startedAt.value, durationMs.value), Date.now(), { locale: enGB }),
);
</script>

<template>
  <div>
    <div text-justify op-70>
      With a concrete example, if you wash 3 plates in 5 minutes and you have 500 plates to wash, it will take you 5
      hours and 10 minutes to wash them all.
    </div>
    <n-divider />
    <div flex gap-2>
      <n-form-item label="Amount of element to consume" flex-1>
        <n-input-number v-model:value="unitCount" :min="1" />
      </n-form-item>
      <n-form-item label="The consumption started at" flex-1>
        <n-date-picker v-model:value="startedAt" type="datetime" />
      </n-form-item>
    </div>

    <n-form-item label="Amount of unit consumed by time span" :show-feedback="false">
      <n-input-number v-model:value="unitPerTimeSpan" :min="1" />
      <span mx-3>in</span>
      <n-input-group>
        <n-input-number v-model:value="timeSpan" :min="1" />
        <n-select
          v-model:value="timeSpanUnitMultiplier"
          :options="[
            { label: 'milliseconds', value: 1 },
            { label: 'seconds', value: 1000 },
            { label: 'minutes', value: 1000 * 60 },
            { label: 'hours', value: 1000 * 60 * 60 },
            { label: 'days', value: 1000 * 60 * 60 * 24 },
          ]"
        />
      </n-input-group>
    </n-form-item>

    <n-divider />
    <c-card mb-2>
      <n-statistic label="Total duration">
        {{ formatMsDuration(durationMs) }}
      </n-statistic>
    </c-card>
    <c-card>
      <n-statistic label="It will end ">
        {{ endAt }}
      </n-statistic>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.n-input-number,
.n-date-picker {
  width: 100%;
}
</style>
