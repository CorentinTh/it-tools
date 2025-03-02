<script setup lang="ts">
import _ from 'lodash';
import { convertFlameToLux, convertFootCandlesToLux, convertLuxToFlame, convertLuxToFootCandles, convertLuxToNox, convertLuxToPhot, convertNoxToLux, convertPhotToLux } from './illuminance-converter.service';

type IlluminanceScale = 'lux' | 'footcandles' | 'nox' | 'phot' | 'flame';

const units = reactive<
  Record<
    string | IlluminanceScale,
    { title: string; unit: string; ref: number; toLux: (v: number) => number; fromLux: (v: number) => number }
  >
      >({
        lux: {
          title: 'Lux',
          unit: 'lx',
          ref: 20000,
          toLux: _.identity,
          fromLux: _.identity,
        },
        footcandles: {
          title: 'Foot-Candles',
          unit: 'ft*c, fc',
          ref: 0,
          toLux: convertFootCandlesToLux,
          fromLux: convertLuxToFootCandles,
        },
        nox: {
          title: 'Nox',
          unit: 'nox',
          ref: 0,
          toLux: convertNoxToLux,
          fromLux: convertLuxToNox,
        },
        phot: {
          title: 'Phot',
          unit: 'ph',
          ref: 0,
          toLux: convertPhotToLux,
          fromLux: convertLuxToPhot,
        },
        flame: {
          title: 'Flame',
          unit: 'flame',
          ref: 0,
          toLux: convertFlameToLux,
          fromLux: convertLuxToFlame,
        },
      });

function update(key: IlluminanceScale) {
  const { ref: value, toLux } = units[key];

  const luxs = toLux(value) ?? 0;

  _.chain(units)
    .omit(key)
    .forEach(({ fromLux }, index) => {
      units[index].ref = Math.floor((fromLux(luxs) ?? 0) * 1000000) / 1000000;
    })
    .value();
}

update('lux');
</script>

<template>
  <div>
    <n-input-group v-for="[key, { title, unit }] in Object.entries(units)" :key="key" mb-3 w-full>
      <n-input-group-label style="width: 100px">
        {{ title }}
      </n-input-group-label>

      <n-input-number
        v-model:value="units[key].ref"
        style="flex: 1"
        @update:value="() => update(key as IlluminanceScale)"
      />

      <n-input-group-label style="width: 75px">
        {{ unit }}
      </n-input-group-label>
    </n-input-group>
  </div>
</template>
