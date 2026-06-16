<script setup lang="ts">
import _ from 'lodash';

interface UnitDef {
  title: string
  unit: string
  ref: number
  factor: number
}

const decimalUnits = reactive<Record<string, UnitDef>>({
  b: { title: 'Bytes', unit: 'B', ref: 0, factor: 1 },
  kb: { title: 'Kilobytes', unit: 'KB', ref: 0, factor: 1e3 },
  mb: { title: 'Megabytes', unit: 'MB', ref: 0, factor: 1e6 },
  gb: { title: 'Gigabytes', unit: 'GB', ref: 0, factor: 1e9 },
  tb: { title: 'Terabytes', unit: 'TB', ref: 0, factor: 1e12 },
  pb: { title: 'Petabytes', unit: 'PB', ref: 0, factor: 1e15 },
});

const binaryUnits = reactive<Record<string, UnitDef>>({
  b: { title: 'Bytes', unit: 'B', ref: 0, factor: 1 },
  kib: { title: 'Kibibytes', unit: 'KiB', ref: 0, factor: 1024 },
  mib: { title: 'Mebibytes', unit: 'MiB', ref: 0, factor: 1024 ** 2 },
  gib: { title: 'Gibibytes', unit: 'GiB', ref: 0, factor: 1024 ** 3 },
  tib: { title: 'Tebibytes', unit: 'TiB', ref: 0, factor: 1024 ** 4 },
  pib: { title: 'Pebibytes', unit: 'PiB', ref: 0, factor: 1024 ** 5 },
});

function update(key: string, source: Record<string, UnitDef>) {
  const bytes = (source[key].ref ?? 0) * source[key].factor;

  _.forEach(decimalUnits, (unit, k) => {
    if (source === decimalUnits && k === key) {
      return;
    }
    unit.ref = bytes / unit.factor;
  });

  _.forEach(binaryUnits, (unit, k) => {
    if (source === binaryUnits && k === key) {
      return;
    }
    unit.ref = bytes / unit.factor;
  });
}
</script>

<template>
  <div style="flex: 0 0 100%; display: flex; gap: 16px; align-items: flex-start; justify-content: center">
    <c-card title="Decimal (SI) — Base 1000" style="width: 500px; flex: 0 0 500px">
      <n-input-group v-for="[key, { title, unit }] in Object.entries(decimalUnits)" :key="key" mb-3>
        <n-input-group-label style="flex: 0 0 100px">
          {{ title }}
        </n-input-group-label>
        <n-input-number
          v-model:value="decimalUnits[key].ref"
          style="flex: 1 1 0"
          @update:value="() => update(key, decimalUnits)"
        />
        <n-input-group-label style="flex: 0 0 45px">
          {{ unit }}
        </n-input-group-label>
      </n-input-group>
    </c-card>

    <c-card title="Binary (IEC) — Base 1024" style="width: 500px; flex: 0 0 500px">
      <n-input-group v-for="[key, { title, unit }] in Object.entries(binaryUnits)" :key="key" mb-3>
        <n-input-group-label style="flex: 0 0 100px">
          {{ title }}
        </n-input-group-label>
        <n-input-number
          v-model:value="binaryUnits[key].ref"
          style="flex: 1 1 0"
          @update:value="() => update(key, binaryUnits)"
        />
        <n-input-group-label style="flex: 0 0 45px">
          {{ unit }}
        </n-input-group-label>
      </n-input-group>
    </c-card>
  </div>
</template>
