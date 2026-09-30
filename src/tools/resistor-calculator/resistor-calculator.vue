<script setup lang="ts">
import {
  DIGIT_COLORS,
  MULTIPLIER_BANDS,
  type ResistorBandColor,
  TOLERANCE_BANDS,
  decodeResistor,
} from './resistor-calculator.models';

const bandCount = ref<4 | 5>(4);
const digits = ref<string[]>(['Brown', 'Violet']);
const multiplier = ref('Red');
const tolerance = ref('Gold');

watch(bandCount, (count) => {
  const needed = count - 2;
  if (digits.value.length > needed) {
    digits.value = digits.value.slice(0, needed);
  }
  while (digits.value.length < needed) {
    digits.value.push('Black');
  }
});

function colorOptions(list: (ResistorBandColor & object)[]) {
  return list.map(item => ({ label: item.label, value: item.label }));
}

const digitOptions = colorOptions(DIGIT_COLORS);
const multiplierOptions = colorOptions(MULTIPLIER_BANDS);
const toleranceOptions = colorOptions(TOLERANCE_BANDS);

const decoded = computed(() => {
  try {
    return decodeResistor({
      bandCount: bandCount.value,
      digits: digits.value,
      multiplier: multiplier.value,
      tolerance: tolerance.value,
    });
  }
  catch {
    return undefined;
  }
});

const toleranceRange = computed(() => {
  if (!decoded.value) {
    return undefined;
  }
  const { ohms, tolerance: tol } = decoded.value;
  return `± ${(ohms * tol) / 100} Ω`;
});

function colorFor(label: string) {
  return DIGIT_COLORS.find(item => item.label === label)?.color
  ?? MULTIPLIER_BANDS.find(item => item.label === label)?.color
  ?? TOLERANCE_BANDS.find(item => item.label === label)?.color
  ?? 'transparent';
}
</script>

<template>
  <div style="max-width: 620px; margin: 0 auto;">
    <c-card mb-3>
      <div mb-3 flex items-center justify-between>
        <n-radio-group v-model:value="bandCount">
          <n-radio-button :value="4">
            4 bands
          </n-radio-button>
          <n-radio-button :value="5">
            5 bands
          </n-radio-button>
        </n-radio-group>
      </div>

      <div my-6 flex items-center justify-center>
        <div
          class="resistor-body"
          :style="{ border: `1px solid var(--n-border-color, #ccc)` }"
        >
          <div class="resistor-band lead" />
          <div
            v-for="(color, index) in decoded?.bandColors ?? []"
            :key="index"
            class="resistor-band"
            :style="{ background: colorFor(color) }"
            :class="{ gold: color === 'Gold', silver: color === 'Silver' }"
          />
          <div class="resistor-band lead" />
        </div>
      </div>

      <n-grid cols="2" x-gap="12" y-gap="10">
        <n-gi v-for="(_, index) in bandCount - 2" :key="`d${index}`" span="1">
          <c-select
            v-model:value="digits[index]"
            :label="`Digit band ${index + 1}`"
            label-position="top"
            :options="digitOptions"
            :data-test-id="`digit-${index}`"
          />
        </n-gi>
        <n-gi>
          <c-select
            v-model:value="multiplier"
            label="Multiplier"
            label-position="top"
            :options="multiplierOptions"
          />
        </n-gi>
        <n-gi>
          <c-select
            v-model:value="tolerance"
            label="Tolerance"
            label-position="top"
            :options="toleranceOptions"
          />
        </n-gi>
      </n-grid>
    </c-card>

    <c-card v-if="decoded">
      <div mb-2 flex items-baseline justify-between>
        <span text-2xl font-bold data-test-id="resistor-value">{{ decoded.formatted }}</span>
        <span text-lg op-80>± {{ decoded.tolerance }}%</span>
      </div>
      <div v-if="toleranceRange" text-sm op-70>
        Absolute tolerance range: {{ toleranceRange }}
      </div>
      <div mt-2 text-xs op-50>
        {{ bandCount }}-band resistor · {{ decoded.ohms }} Ω
      </div>
    </c-card>
  </div>
</template>

<style scoped lang="less">
.resistor-body {
  display: flex;
  align-items: stretch;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(#d8c9a3, #c4b088);
}

.resistor-band {
  width: 16px;

  &.lead {
    flex: 1;
  }

  &.gold {
    background: linear-gradient(90deg, #b8912a, #e2c15a, #b8912a);
  }

  &.silver {
    background: linear-gradient(90deg, #a8a8a8, #e0e0e0, #a8a8a8);
  }
}
</style>
