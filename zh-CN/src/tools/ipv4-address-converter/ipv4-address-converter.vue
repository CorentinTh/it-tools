<script setup lang="ts">
import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { ipv4ToInt, ipv4ToIpv6, isValidIpv4 } from './ipv4-address-converter.service';
import { useValidation } from '@/composable/validation';

const rawIpAddress = useStorage('ipv4-converter:ip', '192.168.1.1');

const convertedSections = computed(() => {
  const ipInDecimal = ipv4ToInt({ ip: rawIpAddress.value });

  return [
    {
      label: '十进制: ',
      value: String(ipInDecimal),
    },
    {
      label: '十六进制: ',
      value: convertBase({ fromBase: 10, toBase: 16, value: String(ipInDecimal) }).toUpperCase(),
    },
    {
      label: '二进制: ',
      value: convertBase({ fromBase: 10, toBase: 2, value: String(ipInDecimal) }),
    },
    {
      label: 'Ipv6 (完整): ',
      value: ipv4ToIpv6({ ip: rawIpAddress.value }),
    },
    {
      label: 'Ipv6 (简写): ',
      value: ipv4ToIpv6({ ip: rawIpAddress.value, prefix: '::ffff:' }),
    },
  ];
});

const { attrs: validationAttrs } = useValidation({
  source: rawIpAddress,
  rules: [{ message: '无效的 IPv4 地址', validator: ip => isValidIpv4({ ip }) }],
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawIpAddress" label="IPv4地址:" placeholder="IPv4地址..." />

    <n-divider />

    <input-copyable
      v-for="{ label, value } of convertedSections"
      :key="label"
      :label="label"
      label-position="left"
      label-width="100px"
      label-align="right"
      mb-2
      :value="validationAttrs.validationStatus === 'error' ? '' : value"
      placeholder="设置正确的IPv4地址"
    />
  </div>
</template>
