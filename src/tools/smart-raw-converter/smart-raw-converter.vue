<script setup lang="ts">
import { getSmartValue } from './smart-raw-converter.service';
import { useValidation } from '@/composable/validation';

const inputRegex = /^(?:0x(?<hex>[a-f\d]+)|(?<dec>\d+))$/i;
const rawValue = ref('0xFE45E3');
const rawValueValidation = useValidation({
  source: rawValue,
  rules: [
    {
      validator: (v) => {
        return inputRegex.test(v?.trim());
      },
      message: 'Smart Raw Value must be decimal or "0x" hexadecimal.',
    },
  ],
});
const smartDecodedValue = computed(() => {
  if (!rawValueValidation.isValid) {
    return null;
  }
  const inputMatch = rawValue.value.match(inputRegex);
  const rawValueInt = inputMatch?.groups?.hex
    ? Number.parseInt(inputMatch?.groups?.hex, 16)
    : Number.parseInt(inputMatch?.groups?.dec || '0', 10);
  return getSmartValue(rawValueInt);
});
</script>

<template>
  <div style="max-width: 600px;">
    <c-input-text
      v-model:value="rawValue"
      label="Smart Raw Value"
      placeholder="Put your Smart Raw Value (decimal or '0x' hexa)"
      :validation="rawValueValidation"
      mb-2
    />

    <c-card v-if="smartDecodedValue" title="Decoded">
      <strong>{{ smartDecodedValue.errors }}</strong> in {{ smartDecodedValue.operations }} operations
    </c-card>
  </div>
</template>
