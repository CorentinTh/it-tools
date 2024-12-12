<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  deg: 'degree (°)',
  rad: 'radian',
  turn: 'turn',
  gradian: 'gradian',
  grad: 'grad',
  gon: 'gon',
};
</script>

<template>
  <UnitsConverter default-unit="deg" :supported-units="supportedUnits" label-width="150px" />
</template>
