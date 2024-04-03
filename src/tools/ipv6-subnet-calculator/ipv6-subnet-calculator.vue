<script setup lang="ts">
import isCidr from 'is-cidr';
import { useStorage } from '@vueuse/core';
import Network from '@/libs/ip_calculator/network';
import { withDefaultOnError } from '@/utils/defaults';
import SpanCopyable from '@/components/SpanCopyable.vue';

const ip = useStorage('ipv6-subnet-calculator:ip', '2001:db8:0:85a3:0:0:ac1f:8001/32');

function getNetworkInfo(address: string) {
  const [ip, mask] = address.split('/');
  return new Network(ip.trim(), Number(mask?.trim() || '32'));
}

const networkInfo = computed(() => withDefaultOnError(() =>
  isCidr(ip.value.trim()) === 6 ? getNetworkInfo(ip.value) : undefined, undefined));

const ipValidationRules = [
  {
    message: 'We cannot parse this address, check the format',
    validator: (value: string) => isCidr(value.trim()) === 6,
  },
];

const sections: {
  label: string
  getValue: (net: Network) => string | undefined
  undefinedFallback?: string
}[] = [
  {
    label: 'Full address',
    getValue: net => net.address.toString(),
  },
  {
    label: 'Short address',
    getValue: net => net.toCompressed(net.address || '', net.version || 4)?.toString(),
  },
  {
    label: 'Address as binary',
    getValue: (net) => {
      const binary = net.toBinary();
      const hBin = binary.length / 2;
      return `${binary.substring(0, hBin)} ${
                binary.substring(hBin, binary.length)}`;
    },
  },
  {
    label: 'Address as integer',
    getValue: net => net.toInteger().toString(),
  },
  {
    label: 'Address as hex',
    getValue: net => net.toHEX().toString(),
  },
  {
    label: 'Network address',
    getValue: net => net.getNetwork().toString(),
  },
  {
    label: 'Network address as integer',
    getValue: net => net.networkToInteger().toString(),
  },
  {
    label: 'Network mask size',
    getValue: net => net.prefix.toString(),
  },
  {
    label: 'Network mask',
    getValue: net => net.getMask().toString(),
  },
  {
    label: 'Network mask as integer',
    getValue: net => net.maskToInteger().toString(),
  },
  {
    label: 'Network size',
    getValue: net => net.networkSize().toString(),
  },
  {
    label: 'Networks count',
    getValue: net => net.networkCount().toString(),
  },
  {
    label: 'First address',
    getValue: net => net.hostRange()[0],
  },
  {
    label: 'Last address',
    getValue: net => net.hostRange()[1],
  },
  {
    label: 'Type',
    getValue: net => net.printInfo()?.toString(),
  },
];
</script>

<template>
  <div>
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
