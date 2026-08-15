<script setup lang="ts">
import { SHA1 } from 'crypto-js';
import InputCopyable from '@/components/InputCopyable.vue';
import { macAddressValidation } from '@/utils/macAddress';

const macAddress = ref('20:37:06:12:34:56');
const generation = ref(0);
const calculatedSections = computed(() => {
  const timestamp = new Date().getTime() + generation.value * 0;
  const hex40bit = SHA1(timestamp + macAddress.value)
    .toString()
    .substring(30);

  const ula = `fd${hex40bit.substring(0, 2)}:${hex40bit.substring(2, 6)}:${hex40bit.substring(6)}`;

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

const addressValidation = macAddressValidation(macAddress);

function generate() {
  generation.value += 1;
}
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options">
      <n-alert title="How it works" type="info" mb-4>
        This tool follows the first RFC 4193 method: it hashes the current timestamp and MAC address with SHA-1,
        then uses the lower 40 bits to generate the ULA.
      </n-alert>

      <c-input-text
        id="ipv6-ula-mac-address"
        v-model:value="macAddress"
        placeholder="Type a MAC address"
        clearable
        label="MAC address"
        test-id="ipv6-ula-mac-address"
        raw-text
        monospace
        :validation="addressValidation"
      />
    </c-card>

    <c-card v-if="addressValidation.isValid" class="c-generator-output">
      <InputCopyable
        v-for="{ label, value } in calculatedSections"
        :key="label"
        :value="value"
        :label="label"
        label-position="top"
        readonly
        class="mb-3 last:mb-0"
      />
    </c-card>

    <div class="c-generator-actions">
      <c-button
        type="primary"
        data-test-id="ipv6-ula-generate"
        :disabled="!addressValidation.isValid"
        @click="generate"
      >
        Generate
      </c-button>
    </div>
  </div>
</template>
