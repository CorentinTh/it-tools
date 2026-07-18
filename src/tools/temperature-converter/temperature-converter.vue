<script setup lang="ts">
import {
  type TemperatureScale,
  convertTemperature,
  temperatureBounds,
  temperatureScales,
} from './temperature-converter.models';

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
  <div>
    <n-input-group v-for="key in temperatureScales" :key="key" mb-3 w-full>
      <n-input-group-label style="width: 100px">
        {{ units[key].title }}
      </n-input-group-label>

      <n-input-number
        v-model:value="units[key].ref"
        :data-testid="`temperature-${key}`"
        :min="temperatureBounds[key].min"
        :max="temperatureBounds[key].max"
        style="flex: 1"
        @update:value="update(key, $event)"
      />

      <n-input-group-label style="width: 50px">
        {{ units[key].unit }}
      </n-input-group-label>
    </n-input-group>
  </div>
</template>
