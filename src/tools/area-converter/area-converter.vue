<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'm²': 'square meter',
  'Pm²': 'square petameter',
  'Tm²': 'square terameter',
  'Gm²': 'square gigameter',
  'Mm²': 'square megameter',
  'km²': 'square kilometer',
  'hm²': 'square hectometer',
  'dam²': 'square decameter',
  'dm²': 'square decimeter',
  'cm²': 'square centimeter',
  'mm²': 'square millimeter',
  'μm²': 'square micrometer',
  'nm²': 'square nanometer',
  'pm²': 'square picometer',
  'fm²': 'square femtometer',
  'ac': 'acre',
  'ca': 'centiare',
  'da': 'deciare',
  'are': 'are',
  'daa': 'decare',
  'ha': 'hectare',
  'ft²': 'square foot (/ft2/sq ft)',
  'in²': 'square inch (/in2/sq in)',
  'yd²': 'square yard (yd2/sq yd)',
  'mi²': 'square mile (mi2/sq mi)',
};
</script>

<template>
  <UnitsConverter default-unit="m²" :supported-units="supportedUnits" label-width="150px" />
</template>
