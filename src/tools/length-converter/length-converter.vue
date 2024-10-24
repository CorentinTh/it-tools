<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  m: 'meter',
  Pm: 'petameter',
  Tm: 'terameter',
  Gm: 'gigameter',
  Mm: 'megameter',
  km: 'kilometer',
  hm: 'hectometer',
  dam: 'decameter',
  dm: 'decimeter',
  cm: 'centimeter',
  mm: 'millimeter',
  µm: 'micrometer',
  nm: 'nanometer',
  pm: 'picometer',
  fm: 'femtometer',
  ft: 'foot (ft/\')',
  in: 'inch (")',
  yd: 'yard',
  mi: 'mile',
  nmi: 'nautical mile (M/NM)',
  ly: 'light-year',
  pc: 'pica',
};
</script>

<template>
  <UnitsConverter default-unit="m" :supported-units="supportedUnits" label-width="150px" />
</template>
