<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { convertMacCISCO, convertMacCanonical, convertMacCanonicalIEEE, convertMacCanonicalIETF } from './mac-address-converter.service';

const input = ref('AA:BB:CC:DD:EE:FF');

const formats = computed(() => [
  {
    label: 'Canonical IETF Format:',
    value: convertMacCanonicalIETF(input.value),
  },
  {
    label: 'Canonical Format:',
    value: convertMacCanonical(input.value),
  },
  {
    label: 'Canonical IEEE Format:',
    value: convertMacCanonicalIEEE(input.value),
  },
  {
    label: 'Cisco:',
    value: convertMacCISCO(input.value),
  },
]);

const inputLabelAlignmentConfig = {
  labelPosition: 'left',
  labelWidth: '120px',
  labelAlign: 'right',
};
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      label="MAC address:"
      size="large"
      placeholder="Type a MAC address"
      clearable
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      mb-5
    />

    <div my-16px divider />

    <InputCopyable
      v-for="format in formats"
      :key="format.label"
      :value="format.value"
      :label="format.label"
      v-bind="inputLabelAlignmentConfig"
      mb-1
    />
  </c-card>
</template>
