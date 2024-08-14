<!-- AspectRatioCalculator.vue -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { NDivider, NInputNumber, NSelect, NSpace } from 'naive-ui';
import {
  type AspectRatio,
  calculateAspectRatio,
  calculateDimensions,
  simplifyRatio,
} from './aspect-ratio-calculator.service';

const width = ref<number | null>(null);
const height = ref<number | null>(null);
const r1 = ref<number | null>(null);
const r2 = ref<number | null>(null);

const presets = [
  { label: 'HD Video 16:9', value: '16:9' },
  { label: 'SD Video 4:3', value: '4:3' },
  { label: 'Widescreen 21:9', value: '21:9' },
  { label: 'Square 1:1', value: '1:1' },
];
const selectedPreset = ref(null);

const aspectRatio = computed((): AspectRatio | null => {
  if (r1.value && r2.value) {
    return simplifyRatio(r1.value, r2.value);
  }
  return null;
});

function updateDimensions(changedField: 'width' | 'height') {
  if (aspectRatio.value) {
    if (changedField === 'width' && width.value) {
      const newDimensions = calculateDimensions(width.value, aspectRatio.value, true);
      height.value = newDimensions.height;
    }
    else if (changedField === 'height' && height.value) {
      const newDimensions = calculateDimensions(height.value, aspectRatio.value, false);
      width.value = newDimensions.width;
    }
  }
}

function handlePresetChange(value: string) {
  const [newR1, newR2] = value.split(':').map(Number);
  r1.value = newR1;
  r2.value = newR2;
  if (width.value) {
    updateDimensions('width');
  }
  else if (height.value) {
    updateDimensions('height');
  }
}

watch([r1, r2], () => {
  if (r1.value && r2.value) {
    if (width.value) {
      updateDimensions('width');
    }
    else if (height.value) {
      updateDimensions('height');
    }
  }
});
</script>

<template>
  <NSpace vertical :size="24">
    <div>
      <h3>Common Presets</h3>
      <NSelect
        v-model:value="selectedPreset"
        :options="presets"
        placeholder="Select a preset"
        @update:value="handlePresetChange"
      />
    </div>

    <div class="input-group">
      <div class="input-pair">
        <label>Pixels width</label>
        <NInputNumber v-model:value="width" placeholder="Pixels width" :min="1" @update:value="() => updateDimensions('width')" />
      </div>
      <div class="input-pair">
        <label>Pixels height</label>
        <NInputNumber v-model:value="height" placeholder="Pixels height" :min="1" @update:value="() => updateDimensions('height')" />
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
  </NSpace>
</template>

<style scoped>
h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

p {
  margin-bottom: 24px;
  color: #a0a0a0;
}

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
  color: #a0a0a0;
}

.separator {
  align-self: flex-end;
  margin-bottom: 7px;
  font-size: 24px;
  font-weight: bold;
}

.result {
  font-size: 18px;
  color: #ffffff;
}

:deep(.n-input-number) {
  width: 100%;
}

:deep(.n-input-number-input) {
  text-align: left;
}

:deep(.n-select) {
  width: 100%;
}

:deep(.n-divider) {
  margin: 16px 0;
}
</style>
