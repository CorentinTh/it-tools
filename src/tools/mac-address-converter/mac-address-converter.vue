<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';

function convertMac(mac: string, group: number = 2, char: string = ':'): string {
  mac = mac.replace(/[\W_]+/g, '');
  return mac.match(new RegExp(`.{1,${group}}`, 'g'))!.join(char);
}

const input = ref('AA:BB:CC:DD:EE:FF');

const formats = computed(() => [
  {
    label: 'Canonical IETF Format:',
    value: convertMac(input.value.toLocaleLowerCase()),
  },
  {
    label: 'Canonical Format:',
    value: convertMac(input.value, 2, '.'),
  },
  {
    label: 'Canonical IEEE Format:',
    value: convertMac(input.value.toLocaleUpperCase(), 2, '-'),
  },
  {
    label: 'Cisco:',
    value: convertMac(input.value.toLocaleLowerCase(), 4, '.'),
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
