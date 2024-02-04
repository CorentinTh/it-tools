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

  const ula = `fd${hex40bit.substring(0, 2)}:${hex40bit.substring(2, 6)}:${hex40bit.substring(6)}`;

  return [
    {
      label: 'IPv6 ULA:',
      value: `${ula}::/48`,
    },
    {
      label: '起始可路由块:',
      value: `${ula}:0::/64`,
    },
    {
      label: '结束可路由块:',
      value: `${ula}:ffff::/64`,
    },
  ];
});

const addressValidation = macAddressValidation(macAddress);
</script>

<template>
  <div>
    <n-alert title="注意" type="info">
      此工具使用 IETF 建议的第一种方法，使用当前时间戳加上 mac 地址、sha1 哈希值和低 40 位来生成随机 ULA。
    </n-alert>

    <c-input-text
      v-model:value="macAddress"
      placeholder="输入MAC地址"
      clearable
      label="MAC地址:"
      raw-text
      my-8
      :validation="addressValidation"
    />

    <div v-if="addressValidation.isValid">
      <InputCopyable
        v-for="{ label, value } in calculatedSections"
        :key="label"
        :value="value"
        :label="label"
        label-width="160px"
        label-align="right"
        label-position="left"
        readonly
        mb-2
      />
    </div>
  </div>
</template>
