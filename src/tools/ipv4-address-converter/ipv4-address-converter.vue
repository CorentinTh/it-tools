<script setup lang="ts">
import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { getIPClass } from '../ipv4-subnet-calculator/ipv4-subnet-calculator.models';
import { ipv4ToInt, ipv4ToIpv6, isValidIpv4 } from './ipv4-address-converter.service';
import { getIPNetworkType, to6to4Prefix, toARPA, toIPv4MappedAddressDecimal } from '@/utils/ip';
import { useValidation } from '@/composable/validation';

const rawIpAddress = useStorage('ipv4-converter:ip', '192.168.1.1'); // NOSONAR

const convertedSections = computed(() => {
  const ipInDecimal = ipv4ToInt({ ip: rawIpAddress.value });

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
      label: 'Ipv6: ',
      value: ipv4ToIpv6({ ip: rawIpAddress.value }),
    },
    {
      label: 'Ipv6 (short): ',
      value: ipv4ToIpv6({ ip: rawIpAddress.value, prefix: '::ffff:' }),
    },
    {
      label: 'Ipv6 (decimal): ',
      value: toIPv4MappedAddressDecimal(rawIpAddress.value),
    },
    {
      label: '6to4 prefix',
      value: to6to4Prefix(rawIpAddress.value),
    },
    {
      label: 'CIDR notation',
      value: `${rawIpAddress.value}/32`,
    },
    {
      label: 'ARPA',
      value: toARPA(rawIpAddress.value),
    },
    {
      label: 'IP class',
      value: getIPClass({ ip: rawIpAddress.value }),
    },
    {
      label: 'Type',
      value: getIPNetworkType(rawIpAddress.value),
    },
  ];
});

const { attrs: validationAttrs } = useValidation({
  source: rawIpAddress,
  rules: [{ message: 'Invalid ipv4 address', validator: ip => isValidIpv4({ ip }) }],
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawIpAddress" label="The ipv4 address:" placeholder="The ipv4 address..." />

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
      placeholder="Set a correct ipv4 address"
    />
  </div>
</template>
