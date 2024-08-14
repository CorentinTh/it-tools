<!-- AspectRatioCalculator.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NInputNumber, NRadio, NRadioGroup, NSpace } from 'naive-ui';
import {
  calculateAspectRatio,
  calculateDimensions,
} from './aspect-ratio-calculator.service';

const width = ref<number | null>(null);
const height = ref<number | null>(null);
const r1 = ref<number | null>(null);
const r2 = ref<number | null>(null);
const mode = ref<'ratio' | 'dimensions'>('ratio');
const result = ref<string | null>(null);

function calculateResult() {
  if (mode.value === 'ratio' && width.value && height.value) {
    const ratio = calculateAspectRatio(width.value, height.value);
    r1.value = ratio.r1;
    r2.value = ratio.r2;
    result.value = `Aspect Ratio: ${ratio.r1}:${ratio.r2}`;
  }
  else if (mode.value === 'dimensions' && r1.value && r2.value) {
    if (width.value) {
      const dimensions = calculateDimensions(width.value, { r1: r1.value, r2: r2.value }, true);
      height.value = dimensions.height;
      result.value = `Dimensions: ${dimensions.width}x${dimensions.height}`;
    }
    else if (height.value) {
      const dimensions = calculateDimensions(height.value, { r1: r1.value, r2: r2.value }, false);
      width.value = dimensions.width;
      result.value = `Dimensions: ${dimensions.width}x${dimensions.height}`;
    }
    else {
      result.value = 'Please enter either width or height to calculate dimensions';
    }
  }
  else {
    result.value = 'Please fill in the required fields';
  }
}

function clearAll() {
  width.value = null;
  height.value = null;
  r1.value = null;
  r2.value = null;
  result.value = null;
}
</script>

<template>
  <NSpace vertical :size="24">
    <NRadioGroup v-model:value="mode">
      <NRadio value="ratio">
        Calculate Aspect Ratio
      </NRadio>
      <NRadio value="dimensions">
        Calculate Dimensions
      </NRadio>
    </NRadioGroup>

    <div class="input-group">
      <div class="input-pair">
        <label>Pixels width</label>
        <NInputNumber v-model:value="width" placeholder="Pixels width" :min="1" />
      </div>
      <div class="input-pair">
        <label>Pixels height</label>
        <NInputNumber v-model:value="height" placeholder="Pixels height" :min="1" />
      </div>
    </div>

    <div class="input-group">
      <div class="input-pair">
        <label>Ratio width</label>
        <NInputNumber v-model:value="r1" placeholder="Ratio width" :min="1" />
      </div>
      <div class="separator">
        :
      </div>
      <div class="input-pair">
        <label>Ratio height</label>
        <NInputNumber v-model:value="r2" placeholder="Ratio height" :min="1" />
      </div>
    </div>

    <div class="button-container">
      <NButton type="primary" @click="calculateResult">
        Calculate
      </NButton>
      <NButton @click="clearAll">
        Clear All
      </NButton>
    </div>

    <div v-if="result" class="result">
      {{ result }}
    </div>
  </NSpace>
</template>

<style scoped>
.input-group {
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.input-pair {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-pair label {
  margin-bottom: 4px;
}

.separator {
  align-self: flex-end;
  margin-bottom: 7px;
  font-size: 24px;
  font-weight: bold;
}

.button-container {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.button-container .n-button {
  flex: 1;
}

.result {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

:deep(.n-input-number) {
  width: 100%;
}
</style>
