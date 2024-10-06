<script setup lang="ts">
import Luhn from 'luhn-js';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const rawValue = ref('44540661970241257');
const cleanedValue = computed(() => rawValue.value.replace(/[^\d]/g, ''));
const isValid = computed(() => {
  try {
    return Luhn.isValid(cleanedValue.value);
  }
  catch (_) {
    return false;
  }
});
const luhnInfos = computed<CKeyValueListItems>(() => {
  return [
    {
      label: 'Is valid ?',
      value: isValid.value,
    },
    {
      label: 'Luhn Key',
      value: (isValid.value
        ? cleanedValue.value.slice(-1)
        : Luhn.generate(cleanedValue.value).slice(-1)) || '',
    },
    {
      label: 'Value with Luhn Key',
      value: (isValid.value
        ? cleanedValue.value
        : Luhn.generate(cleanedValue.value)) || '',
    },
  ];
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawValue" placeholder="Enter a 'Luhn validated' value..." />
    <n-alert v-if="!isValid" type="error">
      Invalid Luhn Key.
      <input-copyable label="Probably correct" label-position="left" :value="Luhn.generate(cleanedValue)" disabled="true" />
    </n-alert>

    <c-card v-if="luhnInfos.length > 0" mt-5 title="Infos">
      <c-key-value-list :items="luhnInfos" />
    </c-card>
  </div>
</template>
