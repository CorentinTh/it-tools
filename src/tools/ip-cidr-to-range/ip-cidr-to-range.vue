<script setup lang="ts">
import isCidr from 'is-cidr';
import { expand } from 'cidr-tools';
import { getIPNetworkType, parseAsCIDR } from '@/utils/ip';
import { useValidation } from '@/composable/validation';

const rawCIDR = useStorage('ip-cidr-to-range:cidr', '192.168.1.0/24'); // NOSONAR

const result = computed(() => {
  const parsedCIDR = parseAsCIDR(rawCIDR.value) || rawCIDR.value;
  const ips = expand(parsedCIDR);
  if (!ips || !ips.length) {
    return undefined;
  }

  return {
    startIpAddress: ips.slice(0, 1)[0],
    endIpAddress: ips.slice(-1)[0],
    parsedCIDR,
    networkType: getIPNetworkType(ips.slice(0, 1)[0]) || 'Public',
  };
});

const cidrValidation = useValidation({
  source: rawCIDR,
  rules: [{ message: 'Invalid ipv4/6 CIDR', validator: cidr => isCidr(parseAsCIDR(cidr) || cidr) }],
});

const showResult = computed(() => cidrValidation.isValid && result.value !== undefined);
</script>

<template>
  <div>
    <c-input-text
      v-model:value="rawCIDR"
      label="IPv4/6 CIDR (ie, 1.0.0.0/23 or 1.1.1.1/255.255.252.0 or 1.1.1.1-2.2.2.2 or 10.0.0.*)"
      placeholder="IPv4/6 CIDR (ie, 1.0.0.0/23  or 1.1.1.1/255.255.252.0 or 1.1.1.1-2.2.2.2 or 10.0.0.*)"
      :validation="cidrValidation"
      clearable
    />

    <c-card v-if="showResult" title="Resulting CIDR" mt-4>
      <input-copyable
        label="CIDR"
        label-position="left"
        label-width="150px"
        label-align="right"

        :value="result?.parsedCIDR"
        disabled mb-2
      />
    </c-card>

    <c-card v-if="showResult" title="IPv4/6 range" mt-4>
      <input-copyable
        label="Start IP Address"
        label-position="left"
        label-width="150px"
        label-align="right"

        :value="result?.startIpAddress"
        disabled mb-2
      />
      <input-copyable
        label="End IP Address"
        label-position="left"
        label-width="150px"
        label-align="right"

        :value="result?.endIpAddress"
        disabled mb-2
      />

      <input-copyable
        label="Network type"
        label-position="left"
        label-width="150px"
        label-align="right"

        :value="result?.networkType"
        disabled mb-2
      />
    </c-card>
  </div>
</template>
