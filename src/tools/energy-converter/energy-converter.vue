<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  J: 'joule',
  PJ: 'petajoule',
  TJ: 'terajoule',
  GJ: 'gigajoule',
  MJ: 'megajoule',
  kJ: 'kilojoule',
  hJ: 'hectojoule',
  daJ: 'decajoule',
  dJ: 'decijoule',
  cJ: 'centijoule',
  mJ: 'millijoule',
  µJ: 'microjoule',
  nJ: 'nanojoule',
  pJ: 'picojoule',
  fJ: 'femtojoule',
  Wh: 'watt-hour',
  PWh: 'petawatt-hour',
  TWh: 'terawatt-hour',
  GWh: 'gigawatt-hour',
  MWh: 'megawatt-hour',
  kWh: 'kilowatt-hour',
  hWh: 'hectowatt-hour',
  daWh: 'decawatt-hour',
  dWh: 'deciwatt-hour',
  cWh: 'centiwatt-hour',
  mWh: 'milliwatt-hour',
  µWh: 'microwatt-hour',
  nWh: 'nanowatt-hour',
  pWh: 'picowatt-hour',
  fWh: 'femtowatt-hour',
};
</script>

<template>
  <UnitsConverter default-unit="J" :supported-units="supportedUnits" label-width="150px" />
</template>
