<template>
  <div>
    <n-text depth="3" style="text-align: justify; width: 100%; display: inline-block">
      With a concrete example, if you wash 3 plates in 5 minutes and you have 500 plates to wash, it will take you 5
      hours and 10 minutes to wash them all, and if you start now, you'll end
      {{ endAt }}.
    </n-text>
    <n-divider />
    <n-space item-style="flex:1 1 0">
      <div>
        <n-space item-style="flex:1 1 0">
          <n-form-item label="Amount of element to consume">
            <n-input-number v-model:value="unitCount" :min="1" />
          </n-form-item>
          <n-form-item label="The consumption started at">
            <n-date-picker v-model:value="startedAt" type="datetime" />
          </n-form-item>
        </n-space>

        <n-form-item label="Amount of unit consumed by time span" :show-feedback="false">
          <n-input-number v-model:value="unitPerTimeSpan" :min="1" />
          <span style="margin: 0 10px">in</span>
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
            ></n-select>
          </n-input-group>
        </n-form-item>

        <n-divider />
        <n-space vertical>
          <c-card>
            <n-statistic label="Total duration">{{ formatMsDuration(durationMs) }}</n-statistic>
          </c-card>
          <c-card>
            <n-statistic label="It will end ">{{ endAt }}</n-statistic>
          </c-card>
        </n-space>
      </div>
    </n-space>
  </div>
</template>

<script setup lang="ts">
// Duplicate issue with sub directory
// eslint-disable-next-line import/no-duplicates
import { addMilliseconds, formatRelative } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { enGB } from 'date-fns/locale';
import { computed, ref } from 'vue';
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

<style lang="less" scoped>
.n-input-number,
.n-date-picker {
  width: 100%;
}
</style>
