<script setup lang="ts">
import { isIPv6 } from 'is-ip';
import { parse } from 'cidr-tools';
import { stringifyIp } from 'ip-bigint';
import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { useValidation } from '@/composable/validation';

const rawIpAddress = useStorage('ipv6-converter:ip', '2001:db8:0:85a3::ac1f:8001');

const convertedSections = computed(() => {
  try {
    const parsedIPv6 = parse(rawIpAddress.value);
    const ipInDecimal = parsedIPv6.start;

    return [
      {
        label: 'Decimal: ',
        value: String(ipInDecimal),
      },
      {
        label: 'Hexadecimal: ',
        value: convertBase({ fromBase: 10, toBase: 16, value: String(ipInDecimal) }).toUpperCase(),
      },
      {
        label: 'Binary: ',
        value: convertBase({ fromBase: 10, toBase: 2, value: String(ipInDecimal) }),
      },
      {
        label: 'CIDR: ',
        value: parsedIPv6.cidr,
      },
      {
        label: 'Ipv6 (short): ',
        value: stringifyIp({ number: ipInDecimal, version: 6 }, { compress: true }),
      },
      {
        label: 'Ipv6 (long): ',
        value: stringifyIp({ number: ipInDecimal, version: 6 }, { compress: false }),
      },
    ];
  }
  catch (e) {
    return [];
  }
});

const { attrs: validationAttrs } = useValidation({
  source: rawIpAddress,
  rules: [{ message: 'Invalid ipv6 address', validator: ip => isIPv6(ip) }],
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawIpAddress" label="The ipv6 address:" placeholder="The ipv6 address..." />

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
      placeholder="Set a correct ipv6 address"
    />
  </div>
</template>
