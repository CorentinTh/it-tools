<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'Pa': 'pascal',
  'PPa': 'pettapascal',
  'TPa': 'terapascal',
  'GPa': 'gigapascal',
  'MPa': 'megapascal',
  'kPa': 'kilopascal',
  'hPa': 'hectopascal',
  'daPa': 'decapascal',
  'dPa': 'decipascal',
  'cPa': 'centipascal',
  'mPa': 'millipascal',
  'μPa': 'micropascal',
  'nPa': 'nanopascal',
  'pPa': 'picopascal',
  'fPa': 'femtopascal',
  'bar': 'bar',
  'Pbar': 'petabar',
  'Tbar': 'terabar',
  'Gbar': 'gigabar',
  'Mbar': 'megabar',
  'kbar': 'kilobar',
  'hbar': 'hectobar',
  'dabar': 'decabar',
  'dbar': 'decibar',
  'cbar': 'centibar',
  'mbar': 'millibar',
  'μbar': 'microbar',
  'nbar': 'nanobar',
  'pbar': 'picobar',
  'fbar': 'femtobar',
  'Torr': 'torr',
  'mTorr': 'millitorr',
  'atm': 'atmosphere',
  'psi': 'pound per square inch',
  'lbf/in2': 'lbf/in2',
};
</script>

<template>
  <UnitsConverter default-unit="Pa" :supported-units="supportedUnits" label-width="150px" />
</template>
