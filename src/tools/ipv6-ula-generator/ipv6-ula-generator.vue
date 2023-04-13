<template>
  <div>
    <n-space vertical :size="50">
      <n-alert title="Info" type="info">
        This tool uses the first method suggested by IETF using the current timestamp plus the mac address, sha1 hashed,
        and the lower 40 bits to generate your random ULA.
      </n-alert>

      <n-form-item label="MAC address:" v-bind="validationAttrs">
        <n-input
          v-model:value="macAddress"
          size="large"
          placeholder="Type a MAC address"
          clearable
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </n-form-item>
    </n-space>

    <div v-if="validationAttrs.validationStatus !== 'error'">
      <n-input-group v-for="{ label, value } in calculatedSections" :key="label" style="margin: 5px 0">
        <n-input-group-label style="flex: 0 0 160px"> {{ label }} </n-input-group-label>
        <input-copyable :value="value" readonly />
      </n-input-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SHA1 } from 'crypto-js';
import InputCopyable from '@/components/InputCopyable.vue';
import { macAddressValidation } from '@/utils/macAddress';

const macAddress = ref('20:37:06:12:34:56');
const calculatedSections = computed(() => {
  const timestamp = new Date().getTime();
  const hex40bit = SHA1(timestamp + macAddress.value)
    .toString()
    .substring(30);

  const ula = 'fd' + hex40bit.substring(0, 2) + ':' + hex40bit.substring(2, 6) + ':' + hex40bit.substring(6);

  return [
    {
      label: 'IPv6 ULA:',
      value: `${ula}::/48`,
    },
    {
      label: 'First routable block:',
      value: `${ula}:0::/64`,
    },
    {
      label: 'Last routable block:',
      value: `${ula}:ffff::/64`,
    },
  ];
});

const { attrs: validationAttrs } = macAddressValidation(macAddress);
</script>

<style lang="less" scoped></style>
