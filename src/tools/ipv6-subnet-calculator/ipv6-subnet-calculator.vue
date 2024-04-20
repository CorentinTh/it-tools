<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { Address6 } from 'ip-address';
import { getIPNetworkType, parseAsCIDR } from '@/utils/ip';
import { withDefaultOnError } from '@/utils/defaults';
import SpanCopyable from '@/components/SpanCopyable.vue';
import { isNotThrowing } from '@/utils/boolean';

const ip = useStorage('ipv6-subnet-calculator:ip', '2001:db8:0:85a3:0:0:ac1f:8001/32'); // NOSONAR

const getNetworkInfo = (address: string) => new Address6(parseAsCIDR(address.trim()) || address.trim());
const networkInfo = computed(() => withDefaultOnError(() => getNetworkInfo(ip.value), undefined));

const ipValidationRules = [
  {
    message: 'We cannot parse this address, check the format',
    validator: (value: string) => isNotThrowing(() => getNetworkInfo(value)),
  },
];

const sections: {
  label: string
  getValue: (blocks: Address6) => string | undefined
  undefinedFallback?: string
}[] = [
  {
    label: 'Full address',
    getValue: (block: Address6) => block.canonicalForm(),
  },
  {
    label: 'Short address',
    getValue: (block: Address6) => block.correctForm(),
  },
  {
    label: 'Address as binary',
    getValue: (block: Address6) => (block.binaryZeroPad()).match(/.{8}/g)?.join(':') ?? '',
  },
  {
    label: 'Address as integer',
    getValue: (block: Address6) => BigInt(`0x${block.getBitsBase16(0, 128)}`).toString(),
  },
  {
    label: 'Address as decimal',
    getValue: (block: Address6) => block.decimal(),
  },
  {
    label: 'Address as hex',
    getValue: (block: Address6) => (block.getBitsBase16(0, 128)),
  },
  {
    label: 'Network mask size',
    getValue: (block: Address6) => block.subnetMask.toString(),
  },
  {
    label: 'Network mask',
    getValue: (block: Address6) => BigInt(`0b${'1'.repeat(block.subnetMask).padEnd(128, '0')}`).toString(16).match(/.{4}/g)?.join(':') ?? '',
  },
  {
    label: 'Network mask as integer',
    getValue: (block: Address6) => BigInt(`0b${'1'.repeat(block.subnetMask).padEnd(128, '0')}`).toString(),
  },
  {
    label: 'Network mask as binary',
    getValue: (block: Address6) => '1'.repeat(block.subnetMask).padEnd(128, '0').match(/.{8}/g)?.join(':') ?? '',
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
    label: 'First address',
    getValue: (block: Address6) => block.startAddress().correctForm(),
  },
  {
    label: 'Last address',
    getValue: (block: Address6) => block.endAddress().correctForm(),
  },
  {
    label: 'Scope',
    getValue: (block: Address6) => block.getScope(),
  },
  {
    label: '6to4 Properties',
    getValue: (block: Address6) => JSON.stringify(block.inspect6to4()),
  },
  {
    label: 'Teredo Properties',
    getValue: (block: Address6) => JSON.stringify(block.inspectTeredo()),
  },
  {
    label: 'ARPA',
    getValue: (block: Address6) => block.reverseForm(),
  },
  {
    label: 'Microsoft UNC Transcription',
    getValue: (block: Address6) => block.microsoftTranscription(),
  },
  {
    label: 'Type',
    getValue: (block: Address6) => getIPNetworkType(block.correctForm()),
  },
];
</script>

<template>
  <div w-600>
    <c-input-text
      v-model:value="ip"
      label="An IPv6 address with or without mask"
      placeholder="The ipv6 address..."
      :validation-rules="ipValidationRules"
      mb-4
    />

    <div v-if="networkInfo">
      <n-table>
        <tbody>
          <tr v-for="{ getValue, label, undefinedFallback } in sections" :key="label">
            <td font-bold>
              {{ label }}
            </td>
            <td>
              <SpanCopyable v-if="networkInfo" :value="getValue(networkInfo)" />
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
