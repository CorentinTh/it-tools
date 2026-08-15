<script setup lang="ts">
// Duplicate issue with sub directory

import { addMilliseconds, formatRelative } from 'date-fns';

import { enGB } from 'date-fns/locale';

import { formatMsDuration } from './eta-calculator.service';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';

const unitCount = ref(3 * 62);
const unitPerTimeSpan = ref(3);
const timeSpan = ref(5);
const timeSpanUnitMultiplier = ref(60000);
const startedAt = ref(Date.now());
const startedAtPicker = ref<{ $el: HTMLElement } | null>(null);

onMounted(async () => {
  await nextTick();
  startedAtPicker.value?.$el.querySelector('input')?.setAttribute('aria-label', 'Started at');
});

const durationMs = computed(() => {
  const timeSpanMs = timeSpan.value * timeSpanUnitMultiplier.value;

  return unitCount.value / (unitPerTimeSpan.value / timeSpanMs);
});
const endAt = computed(() =>
  formatRelative(addMilliseconds(startedAt.value, durationMs.value), Date.now(), { locale: enGB }),
);
</script>

<template>
  <div class="c-form-layout">
    <div text-justify op-70>
      With a concrete example, if you wash 5 plates in 3 minutes and you have 500 plates to wash, it will take you 5
      hours to wash them all.
    </div>
    <n-divider />
    <div grid grid-cols-1 gap-3 md:grid-cols-2>
      <c-field label="Total units" label-for="eta-unit-count">
        <CInputNumber id="eta-unit-count" v-model:value="unitCount" :min="1" />
      </c-field>
      <c-field label="Started at">
        <n-date-picker ref="startedAtPicker" v-model:value="startedAt" type="datetime" w-full />
      </c-field>
    </div>

    <div grid grid-cols-1 gap-3 md:grid-cols-3>
      <c-field label="Units consumed" label-for="eta-units-consumed">
        <CInputNumber id="eta-units-consumed" v-model:value="unitPerTimeSpan" :min="1" />
      </c-field>
      <c-field label="Time span" label-for="eta-time-span">
        <CInputNumber id="eta-time-span" v-model:value="timeSpan" :min="1" />
      </c-field>
      <c-select
        v-model:value="timeSpanUnitMultiplier"
        label="Time unit"
        label-position="top"
        :options="[
          { label: 'milliseconds', value: 1 },
          { label: 'seconds', value: 1000 },
          { label: 'minutes', value: 1000 * 60 },
          { label: 'hours', value: 1000 * 60 * 60 },
          { label: 'days', value: 1000 * 60 * 60 * 24 },
        ]"
      />
    </div>

    <n-divider />
    <div grid grid-cols-1 gap-3 md:grid-cols-2>
      <c-card>
        <n-statistic label="Total duration">
          {{ formatMsDuration(durationMs) }}
        </n-statistic>
      </c-card>
      <c-card>
        <n-statistic label="Estimated completion">
          {{ endAt }}
        </n-statistic>
      </c-card>
    </div>
  </div>
</template>
