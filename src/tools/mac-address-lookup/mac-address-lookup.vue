<template>
  <div>
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

    <n-form-item label="Vendor info:">
      <n-card>
        <n-text v-if="details">
          <div v-for="(detail, index) of details.split('\n')" :key="index">{{ detail }}</div>
        </n-text>

        <n-text v-else depth="3" italic>Unknown vendor for this address</n-text>
      </n-card>
    </n-form-item>

    <n-space justify="center">
      <n-button :disabled="!details" tertiary> Copy vendor info </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import db from 'oui/oui.json';
import { macAddressValidation } from '@/utils/macAddress';

const getVendorValue = (address: string) => address.trim().replace(/[.:-]/g, '').toUpperCase().substring(0, 6);

const macAddress = ref('20:37:06:12:34:56');
const details = computed<string | undefined>(() => db[getVendorValue(macAddress.value)]);

const { attrs: validationAttrs } = macAddressValidation(macAddress);
</script>

<style lang="less" scoped></style>
