<script setup lang="ts">
import { computeCost } from './energy-computer.service';

const wattage = ref(100);
const durationHours = ref(2);
const kWhCost = ref(0.1);
const totalCost = computed(() => computeCost(wattage.value, durationHours.value, kWhCost.value));
</script>

<template>
  <div>
    <n-form-item label="Device Wattage" mb-1>
      <n-input-number v-model:value="wattage" :min="0" />
    </n-form-item>
    <n-form-item label="Usage Duration (hours)" mb-1>
      <n-input-number v-model:value="durationHours" :min="0" />
    </n-form-item>
    <n-form-item label="kWh Cost" mb-1>
      <n-input-number v-model:value="kWhCost" :min="0" />
    </n-form-item>

    <n-divider />

    <input-copyable label="Total Cost" :value="totalCost" />
  </div>
</template>
