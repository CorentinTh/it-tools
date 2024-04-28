<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import type { Units } from './hdd-calculator.service';
import { getRealSize } from './hdd-calculator.service';

const units = [
  { value: 'kb', label: 'KB' },
  { value: 'mb', label: 'MB' },
  { value: 'gb', label: 'GB' },
  { value: 'tb', label: 'TB' },
  { value: 'pb', label: 'PB' },
];

const claimedCapacity = ref(1);
const claimedUnit = ref('tb');
</script>

<template>
  <div>
    <n-form-item label="Claimed Capacity:">
      <n-input-number v-model:value="claimedCapacity" :min="1" />
    </n-form-item>
    <c-select
      v-model:value="claimedUnit"
      label="Unit:"
      :options="units"
    />

    <n-divider />

    <InputCopyable
      v-for="({ value, label }) in units"
      :key="value"
      :label="`Capacity in ${label}`"
      :value="getRealSize(claimedCapacity, claimedUnit as Units, value as Units).toFixed(5)"
    />
  </div>
</template>
