<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'N': 'newton',
  'PN': 'petanewton',
  'TN': 'teranewton',
  'GN': 'giganewton',
  'MN': 'meganewton',
  'kN': 'kilonewton',
  'hN': 'hectonewton',
  'daN': 'decanewton',
  'dN': 'decinewton',
  'cN': 'centinewton',
  'mN': 'millinewton',
  'µN': 'micronewton',
  'nN': 'nanonewton',
  'pN': 'piconewton',
  'fN': 'femtonewton',
  'dyn': 'dyne',
  'lbf': 'pound of force',
  'kip': 'kip',
  'klb': 'klb',
  'kipf': 'kipf',
  'klbf': 'klbf',
  'pdl': 'poundal',
  'kgf': 'kilogram-force',
  'kp': 'kilopond',
  'Mp': 'megapond',
  'tf': 'tonne-force',
  'metric tf': 'metric ton-force',
  'megagram-force': 'megagram-force',
};
</script>

<template>
  <UnitsConverter default-unit="N" :supported-units="supportedUnits" label-width="150px" />
</template>
