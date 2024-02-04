<script setup lang="ts">
import { Netmask } from 'netmask';
import { useStorage } from '@vueuse/core';
import { ArrowLeft, ArrowRight } from '@vicons/tabler';
import { getIPClass } from './ipv4-subnet-calculator.models';
import { withDefaultOnError } from '@/utils/defaults';
import { isNotThrowing } from '@/utils/boolean';
import SpanCopyable from '@/components/SpanCopyable.vue';

const ip = useStorage('ipv4-subnet-calculator:ip', '192.168.0.1/24');

const getNetworkInfo = (address: string) => new Netmask(address.trim());

const networkInfo = computed(() => withDefaultOnError(() => getNetworkInfo(ip.value), undefined));

const ipValidationRules = [
  {
    message: '无法解析该地址，请检查格式',
    validator: (value: string) => isNotThrowing(() => getNetworkInfo(value.trim())),
  },
];

const sections: {
  label: string
  getValue: (blocks: Netmask) => string | undefined
  undefinedFallback?: string
}[] = [
  {
    label: '网络掩码',
    getValue: block => block.toString(),
  },
  {
    label: '网络地址',
    getValue: ({ base }) => base,
  },
  {
    label: '子网掩码',
    getValue: ({ mask }) => mask,
  },
  {
    label: '子网掩码 二进制',
    getValue: ({ bitmask }) => ('1'.repeat(bitmask) + '0'.repeat(32 - bitmask)).match(/.{8}/g)?.join('.') ?? '',
  },
  {
    label: '子网掩码 CIDR',
    getValue: ({ bitmask }) => `/${bitmask}`,
  },
  {
    label: '子网掩码 通配符',
    getValue: ({ hostmask }) => hostmask,
  },
  {
    label: '子网数量',
    getValue: ({ size }) => String(size),
  },
  {
    label: '起始地址',
    getValue: ({ first }) => first,
  },
  {
    label: '结束地址',
    getValue: ({ last }) => last,
  },
  {
    label: '广播地址',
    getValue: ({ broadcast }) => broadcast,
    undefinedFallback: '没有广播地址',
  },
  {
    label: 'IP等级',
    getValue: ({ base: ip }) => getIPClass({ ip }),
    undefinedFallback: '未知等级',
  },
];

function switchToBlock({ count = 1 }: { count?: number }) {
  const next = networkInfo.value?.next(count);

  if (next) {
    ip.value = next.toString();
  }
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ip"
      label="IPv4 地址（可带掩码，用/分割）"
      placeholder="IPv4地址 (例：192.168.1.1 或 192.168.1.0/24)"
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
              <SpanCopyable v-if="getValue(networkInfo)" :value="getValue(networkInfo)" />
              <span v-else op-70>
                {{ undefinedFallback }}
              </span>
            </td>
          </tr>
        </tbody>
      </n-table>

      <div mt-3 flex items-center justify-between>
        <c-button @click="switchToBlock({ count: -1 })">
          <n-icon :component="ArrowLeft" />
          上一个网段
        </c-button>
        <c-button @click="switchToBlock({ count: 1 })">
          下一个网段
          <n-icon :component="ArrowRight" />
        </c-button>
      </div>
    </div>
  </div>
</template>
