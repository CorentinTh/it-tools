<script setup lang="ts">
import _ from 'lodash';
import { unitToBits, bitsToUnit, formatPrecision, type StorageUnit } from './data-storage-converter.models';

const units = reactive<Record<StorageUnit, { title: string; ref: number }>>({
  bit: { title: 'Bits', ref: 0 },
  kilobit: { title: 'Kilobits', ref: 0 },
  kilobyte: { title: 'Kilobytes', ref: 0 },
  kibibit: { title: 'Kibibits', ref: 0 },
  kibibyte: { title: 'Kibibytes', ref: 0 },
  megabit: { title: 'Megabits', ref: 0 },
  megabyte: { title: 'Megabytes', ref: 0 },
  mebibit: { title: 'Mebibits', ref: 0 },
  mebibyte: { title: 'Mebibytes', ref: 0 },
  gigabit: { title: 'Gigabits', ref: 0 },
  gigabyte: { title: 'Gigabytes', ref: 0 },
  gibibit: { title: 'Gibibits', ref: 0 },
  gibibyte: { title: 'Gibibytes', ref: 0 },
  terabit: { title: 'Terabits', ref: 0 },
  terabyte: { title: 'Terabytes', ref: 0 },
  tebibit: { title: 'Tebibits', ref: 0 },
  tebibyte: { title: 'Tebibytes', ref: 0 },
  petabit: { title: 'Petabits', ref: 0 },
  petabyte: { title: 'Petabytes', ref: 0 },
  pebibit: { title: 'Pebibits', ref: 0 },
  pebibyte: { title: 'Pebibytes', ref: 0 },
  byte: { title: 'Bytes', ref: 0 },
});

function update(key: StorageUnit) {
  const { ref: value } = units[key];

  const bits = unitToBits(value ?? 0, key);

  _.chain(units)
    .omit(key)
    .forEach((_, index) => {
      units[index as StorageUnit].ref = bitsToUnit(bits, index as StorageUnit);
    })
    .value();
}

update('megabyte');
</script>

<template>
  <div>
    <n-input-group v-for="[key, { title }] in Object.entries(units) as [StorageUnit, { title: string }][]" :key="key" mb-3 w-full>
      <n-input-group-label style="width: 120px">
        {{ title }}
      </n-input-group-label>

      <n-input-number
        v-model:value="units[key].ref"
        style="flex: 1"
        :placeholder="`Value in ${title.toLowerCase()}`"
        @update:value="() => update(key)"
      />
    </n-input-group>
  </div>
</template>
