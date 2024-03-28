<script setup lang="ts">
import { Address6 } from 'ip-address';
import { useStorage } from '@vueuse/core';
import { withDefaultOnError } from '@/utils/defaults';
import { isNotThrowing } from '@/utils/boolean';
import SpanCopyable from '@/components/SpanCopyable.vue';

const ip = useStorage('ipv6-subnet-calculator:ip', 'fd00::1/64');

const getNetworkInfo = (address: string) => new Address6(address.trim());

const networkInfo = computed(() => withDefaultOnError(() => getNetworkInfo(ip.value), undefined));

const ipValidationRules = [
  {
    message: 'We cannot parse this address, check the format',
    validator: (value: string) => isNotThrowing(() => getNetworkInfo(value.trim())),
  },
];

const sections: {
  label: string
  getValue: (blocks: Address6) => string | undefined
  undefinedFallback?: string
}[] = [
  {
    label: 'IP address',
    getValue: (block: Address6) => block.correctForm(),
  },
  {
    label: 'Full IP address',
    getValue: (block: Address6) => block.canonicalForm(),
  },
  {
    label: 'Total IP addresses',
    getValue: (block: Address6) => {
      const totalAddresses = BigInt(2) ** BigInt(128 - block.subnetMask);
      return totalAddresses.toString();
    },
  },
  {
    label: 'Total networks',
    getValue: ({ subnetMask }) => subnetMask <= 64 ? (BigInt(2) ** BigInt(64 - subnetMask)).toString() : '',
  },
  {
    label: 'Netmask',
    getValue: ({ subnetMask }) => subnetMask.toString(),
  },
  {
    label: 'Network size',
    getValue: (block: Address6) => block.possibleSubnets().toString(),
  },
  {
    label: 'First address',
    getValue: (block: Address6) => block.startAddress().correctForm(),
  },
  {
    label: 'Last address',
    getValue: (block: Address6) => block.endAddress().correctForm(),
  },
  {
    label: 'IP range',
    getValue: (block: Address6) => `${block.startAddress().correctForm()} - ${block.endAddress().correctForm()}`,
  },
];
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ip" label="An IPv6 address with or without mask" placeholder="The ipv6 address..."
      :validation-rules="ipValidationRules" mb-4
    />

    <div v-if="networkInfo">
      <n-table>
        <tbody>
          <tr v-for="{ getValue, label, undefinedFallback } in sections" :key="label">
            <td font-bold>
              {{ label }}
            </td>
            <td>
              <SpanCopyable v-if="getValue(networkInfo)" :value="getValue(networkInfo)" />
              <span v-else op-70>
                {{ undefinedFallback }}
              </span>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
</template>
