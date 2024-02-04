<script setup lang="ts">
// Duplicate issue with sub directory

import { addMilliseconds, formatRelative } from 'date-fns';

import { zhCN } from 'date-fns/locale';

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
  formatRelative(addMilliseconds(startedAt.value, durationMs.value), Date.now(), { locale: zhCN }),
);
</script>

<template>
  <div>
    <div text-justify op-70>
      举个例子，如果你3分钟洗5个盘子，你还有500个盘子要洗，那么你需要5个小时才能全部洗完。
    </div>
    <n-divider />
    <div flex gap-2>
      <n-form-item label="任务数量" flex-1>
        <n-input-number v-model:value="unitCount" :min="1" />
      </n-form-item>
      <n-form-item label="开始时间" flex-1>
        <n-date-picker v-model:value="startedAt" type="datetime" />
      </n-form-item>
    </div>

    <p>速度</p>
    <div flex flex-col items-baseline gap-y-2 md:flex-row>
      <div flex items-baseline gap-2>
        <span>每</span>
        <n-input-number v-model:value="timeSpan" min-w-130px :min="1" />
        <c-select
          v-model:value="timeSpanUnitMultiplier"
          min-w-130px
          :options="[
            { label: '毫秒', value: 1 },
            { label: '秒钟', value: 1000 },
            { label: '分钟', value: 1000 * 60 },
            { label: '小时', value: 1000 * 60 * 60 },
            { label: '天', value: 1000 * 60 * 60 * 24 },
          ]"
        />
        <span mr-2>做</span>
      </div>
      <n-input-number v-model:value="unitPerTimeSpan" :min="1" />
    </div>

    <n-divider />
    <c-card mb-2>
      <n-statistic label="共需多少时间">
        {{ formatMsDuration(durationMs) }}
      </n-statistic>
    </c-card>
    <c-card>
      <n-statistic label="将在什么时间结束">
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
