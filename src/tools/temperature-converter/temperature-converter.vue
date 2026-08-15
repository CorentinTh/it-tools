<script setup lang="ts">
import {
  type TemperatureScale,
  convertTemperature,
  temperatureBounds,
  temperatureScales,
} from './temperature-converter.models';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';

interface TemperatureUnit {
  title: string
  unit: string
  ref: number | null
}

const units = reactive<Record<TemperatureScale, TemperatureUnit>>({
  kelvin: {
    title: 'Kelvin',
    unit: 'K',
    ref: 0,
  },
  celsius: {
    title: 'Celsius',
    unit: '°C',
    ref: 0,
  },
  fahrenheit: {
    title: 'Fahrenheit',
    unit: '°F',
    ref: 0,
  },
  rankine: {
    title: 'Rankine',
    unit: '°R',
    ref: 0,
  },
  delisle: {
    title: 'Delisle',
    unit: '°De',
    ref: 0,
  },
  newton: {
    title: 'Newton',
    unit: '°N',
    ref: 0,
  },
  reaumur: {
    title: 'Réaumur',
    unit: '°Ré',
    ref: 0,
  },
  romer: {
    title: 'Rømer',
    unit: '°Rø',
    ref: 0,
  },
});

function update(sourceScale: TemperatureScale, value: number | null) {
  if (value === null) {
    return;
  }

  for (const targetScale of temperatureScales) {
    if (targetScale === sourceScale) {
      continue;
    }

    const convertedTemperature = convertTemperature(value, sourceScale, targetScale);
    if (convertedTemperature !== null) {
      units[targetScale].ref = convertedTemperature;
    }
  }
}

update('kelvin', units.kelvin.ref);
</script>

<template>
  <div class="c-form-layout">
    <div grid grid-cols-1 gap-3 md:grid-cols-2>
      <c-field
        v-for="key in temperatureScales"
        :key="key"
        :label="`${units[key].title} (${units[key].unit})`"
        :label-for="`temperature-${key}`"
      >
        <CInputNumber
          :id="`temperature-${key}`"
          v-model:value="units[key].ref"
          :data-testid="`temperature-${key}`"
          :min="temperatureBounds[key].min"
          :max="temperatureBounds[key].max"
          @update:value="update(key, $event)"
        />
      </c-field>
    </div>
  </div>
</template>
