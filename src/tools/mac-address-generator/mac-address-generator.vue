<script setup lang="ts">
import _ from 'lodash';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { partialMacAddressValidation, partialMacAddressValidationRules } from '@/utils/macAddress';

const amount = useStorage('mac-address-generator-amount', 1);
const uppercase = useStorage('mac-address-generator-uppercase', true);
const macAddressPrefix = useStorage('mac-address-generator-prefix', '64:16:7F');

const [macAddresses, refreshMacAddresses] = computedRefreshable(() => {
  if (!partialMacAddressValidation(macAddressPrefix).isValid) {
    return '';
  }

  const ids = _.times(amount.value, () => generateMac(macAddressPrefix.value));
  return ids.join('\n');
});

const { copy } = useCopy({ source: macAddresses, text: 'MAC addresses copied to the clipboard' });

function generateMac(prefix: string = ''): string {
  let mac = prefix;

  for (let i = prefix.length; i < 17; i++) {
    if (i % 3 === 2) { // Place ':' after every 2 hex characters
      mac += ':';
    }
    else {
      mac += Math.floor(Math.random() * 16).toString(16);
    }
  }

  return uppercase.value ? mac.toUpperCase() : mac;
}
</script>

<template>
  <div flex flex-col justify-center gap-2>
    <div flex items-center>
      <label w-75px> Quantity:</label>
      <n-input-number v-model:value="amount" min="1" max="100" flex-1 />
    </div>

    <c-input-text
      v-model:value="macAddressPrefix"
      label="MAC address prefix:"
      placeholder="Type a MAC address"
      clearable
      label-position="left"
      spellcheck="false"
      :validation-rules="partialMacAddressValidationRules"
      mb-5
    />

    <n-checkbox v-model:checked="uppercase">
      Uppercase
    </n-checkbox>

    <c-card mt-5 flex data-test-id="ulids">
      <pre m-0 m-x-auto>{{ macAddresses }}</pre>
    </c-card>

    <div flex justify-center gap-2>
      <c-button data-test-id="refresh" @click="refreshMacAddresses()">
        Refresh
      </c-button>
      <c-button @click="copy()">
        Copy
      </c-button>
    </div>
  </div>
</template>
