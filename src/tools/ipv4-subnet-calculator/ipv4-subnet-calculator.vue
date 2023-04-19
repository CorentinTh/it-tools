<template>
  <div>
    <n-form-item label="An IPv4 address with or without mask" v-bind="validationAttrs">
      <n-input v-model:value="ip" />
    </n-form-item>

    <div v-if="networkInfo">
      <n-table>
        <tbody>
          <tr v-for="{ getValue, label, undefinedFallback } in sections" :key="label">
            <td>
              <n-text strong>{{ label }}</n-text>
            </td>
            <td>
              <span-copyable v-if="getValue(networkInfo)" :value="getValue(networkInfo)"></span-copyable>
              <n-text v-else depth="3">{{ undefinedFallback }}</n-text>
            </td>
          </tr>
        </tbody>
      </n-table>

      <n-space style="margin-top: 14px" justify="space-between">
        <c-button @click="switchToBlock({ count: -1 })">
          <n-icon :component="ArrowLeft" />
          Previous block
        </c-button>
        <c-button @click="switchToBlock({ count: 1 })">
          Next block
          <n-icon :component="ArrowRight" />
        </c-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Netmask } from 'netmask';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { useStorage } from '@vueuse/core';
import { ArrowLeft, ArrowRight } from '@vicons/tabler';
import SpanCopyable from '@/components/SpanCopyable.vue';
import { getIPClass } from './ipv4-subnet-calculator.models';

const ip = useStorage('ipv4-subnet-calculator:ip', '192.168.0.1/24');

const getNetworkInfo = (address: string) => new Netmask(address.trim());

const networkInfo = computed(() => withDefaultOnError(() => getNetworkInfo(ip.value), undefined));

const { attrs: validationAttrs } = useValidation({
  source: ip,
  rules: [
    {
      message: 'We cannot parse this address, check the format',
      validator: (value) => isNotThrowing(() => getNetworkInfo(value.trim())),
    },
  ],
});

const sections: {
  label: string;
  getValue: (blocks: Netmask) => string | undefined;
  undefinedFallback?: string;
}[] = [
  {
    label: 'Netmask',
    getValue: (block) => block.toString(),
  },
  {
    label: 'Network address',
    getValue: ({ base }) => base,
  },
  {
    label: 'Network mask',
    getValue: ({ mask }) => mask,
  },
  {
    label: 'Network mask in binary',
    getValue: ({ bitmask }) => ('1'.repeat(bitmask) + '0'.repeat(32 - bitmask)).match(/.{8}/g)?.join('.') ?? '',
  },
  {
    label: 'CIDR notation',
    getValue: ({ bitmask }) => `/${bitmask}`,
  },
  {
    label: 'Wildcard mask',
    getValue: ({ hostmask }) => hostmask,
  },
  {
    label: 'Network size',
    getValue: ({ size }) => String(size),
  },
  {
    label: 'First address',
    getValue: ({ first }) => first,
  },
  {
    label: 'Last address',
    getValue: ({ last }) => last,
  },
  {
    label: 'Broadcast address',
    getValue: ({ broadcast }) => broadcast,
    undefinedFallback: 'No broadcast address with this mask',
  },
  {
    label: 'IP class',
    getValue: ({ base: ip }) => getIPClass({ ip }),
    undefinedFallback: 'Unknown class type',
  },
];

function switchToBlock({ count = 1 }: { count?: number }) {
  const next = networkInfo.value?.next(count);

  if (next) {
    ip.value = next.toString();
  }
}
</script>

<style lang="less" scoped></style>
