<script setup lang="ts">
import _ from 'lodash';
import {
  convertCelsiusToKelvin,
  convertDelisleToKelvin,
  convertFahrenheitToKelvin,
  convertKelvinToCelsius,
  convertKelvinToDelisle,
  convertKelvinToFahrenheit,
  convertKelvinToNewton,
  convertKelvinToRankine,
  convertKelvinToReaumur,
  convertKelvinToRomer,
  convertNewtonToKelvin,
  convertRankineToKelvin,
  convertReaumurToKelvin,
  convertRomerToKelvin,
} from './temperature-converter.models';

type TemperatureScale = 'kelvin' | 'celsius' | 'fahrenheit' | 'rankine' | 'delisle' | 'newton' | 'reaumur' | 'romer';

const units = reactive<
  Record<
    string | TemperatureScale,
    { title: string; unit: string; ref: number; toKelvin: (v: number) => number; fromKelvin: (v: number) => number }
  >
      >({
        kelvin: {
          title: 'Kelvin',
          unit: 'K',
          ref: 0,
          toKelvin: _.identity,
          fromKelvin: _.identity,
        },
        celsius: {
          title: 'Celsius',
          unit: '°C',
          ref: 0,
          toKelvin: convertCelsiusToKelvin,
          fromKelvin: convertKelvinToCelsius,
        },
        fahrenheit: {
          title: 'Fahrenheit',
          unit: '°F',
          ref: 0,
          toKelvin: convertFahrenheitToKelvin,
          fromKelvin: convertKelvinToFahrenheit,
        },
        rankine: {
          title: 'Rankine',
          unit: '°R',
          ref: 0,
          toKelvin: convertRankineToKelvin,
          fromKelvin: convertKelvinToRankine,
        },
        delisle: {
          title: 'Delisle',
          unit: '°De',
          ref: 0,
          toKelvin: convertDelisleToKelvin,
          fromKelvin: convertKelvinToDelisle,
        },
        newton: {
          title: 'Newton',
          unit: '°N',
          ref: 0,
          toKelvin: convertNewtonToKelvin,
          fromKelvin: convertKelvinToNewton,
        },
        reaumur: {
          title: 'Réaumur',
          unit: '°Ré',
          ref: 0,
          toKelvin: convertReaumurToKelvin,
          fromKelvin: convertKelvinToReaumur,
        },
        romer: {
          title: 'Rømer',
          unit: '°Rø',
          ref: 0,
          toKelvin: convertRomerToKelvin,
          fromKelvin: convertKelvinToRomer,
        },
      });

const belowAbsoluteZero = ref(false);

function update(key: TemperatureScale) {
  const { ref: value, toKelvin } = units[key];

  const raw = toKelvin(value) ?? 0;
  belowAbsoluteZero.value = raw < 0;
  // temperatures below absolute zero (0 K) are unphysical
  const kelvins = Math.max(raw, 0);

  _.chain(units)
    .omit(key)
    .forEach(({ fromKelvin }, index) => {
      // round to 2 decimals: floor() biased negative values down by 0.01 (#1486)
      units[index].ref = Math.round((fromKelvin(kelvins) ?? 0) * 100) / 100;
    })
    .value();
}

update('kelvin');
</script>

<template>
  <div>
    <c-alert v-if="belowAbsoluteZero" type="warning" mb-3>
      That temperature is below absolute zero (0 K), which is physically impossible — values are clamped.
    </c-alert>
    <n-input-group v-for="[key, { title, unit }] in Object.entries(units)" :key="key" mb-3 w-full>
      <n-input-group-label style="width: 100px">
        {{ title }}
      </n-input-group-label>

      <n-input-number
        v-model:value="units[key].ref"
        style="flex: 1"
        @update:value="() => update(key as TemperatureScale)"
      />

      <n-input-group-label style="width: 50px">
        {{ unit }}
      </n-input-group-label>
    </n-input-group>
  </div>
</template>
