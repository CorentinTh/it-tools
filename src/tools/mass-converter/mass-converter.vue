<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'g': 'gram',
  'Pg': 'petagram',
  'Tg': 'teragram',
  'Gg': 'gigagram',
  'Mg': 'megagram',
  'kg': 'kilogram',
  'hg': 'hectogram',
  'dag': 'decagram',
  'dg': 'decigram',
  'cg': 'centigram',
  'mg': 'milligram',
  'μg': 'microgram',
  'ng': 'nanogram',
  'pg': 'picogram',
  'fg': 'femtogram',
  'tonne': 'tonne',
  't': 'metric ton',
  'kt': 'kilotonne',
  'Mt': 'megatonne',
  'Gt': 'gigatonne',
  'lb': 'pound',
  'st': 'stone',
  'oz': 'ounce',
  'short ton': 'short ton',
  'US ton': 'US ton',
  'long ton': 'long ton',
  'imperial ton': 'imperial ton',
  'displacement ton': 'displacement ton',
};
</script>

<template>
  <UnitsConverter default-unit="g" :supported-units="supportedUnits" label-width="150px" />
</template>
