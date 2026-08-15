<script setup lang="ts">
import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { ipv4ToInt, ipv4ToIpv6, isValidIpv4 } from './ipv4-address-converter.service';
import { useValidation } from '@/composable/validation';

const rawIpAddress = ref('192.168.1.1');

const convertedSections = computed(() => {
  const ipInDecimal = ipv4ToInt({ ip: rawIpAddress.value });

  return [
    {
      label: 'Decimal',
      value: String(ipInDecimal),
    },
    {
      label: 'Hexadecimal',
      value: convertBase({ fromBase: 10, toBase: 16, value: String(ipInDecimal) }).toUpperCase(),
    },
    {
      label: 'Binary',
      value: convertBase({ fromBase: 10, toBase: 2, value: String(ipInDecimal) }),
    },
    {
      label: 'IPv6',
      value: ipv4ToIpv6({ ip: rawIpAddress.value }),
    },
    {
      label: 'IPv6 (short)',
      value: ipv4ToIpv6({ ip: rawIpAddress.value, prefix: '::ffff:' }),
    },
  ];
});

const { attrs: validationAttrs } = useValidation({
  source: rawIpAddress,
  rules: [{ message: 'Invalid ipv4 address', validator: ip => isValidIpv4({ ip }) }],
});
</script>

<template>
  <div class="c-form-layout">
    <c-card title="Input">
      <c-input-text v-model:value="rawIpAddress" label="IPv4 address" placeholder="The IPv4 address..." />
    </c-card>

    <c-card title="Converted values">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <input-copyable
          v-for="{ label, value } of convertedSections"
          :key="label"
          :label="label"
          :value="validationAttrs.validationStatus === 'error' ? '' : value"
          placeholder="Set a correct IPv4 address"
          readonly
          monospace
        />
      </div>
    </c-card>
  </div>
</template>
