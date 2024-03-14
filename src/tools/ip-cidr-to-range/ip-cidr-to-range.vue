<script setup lang="ts">
import isCidr from 'is-cidr';
import { expand } from 'cidr-tools';
import { useValidation } from '@/composable/validation';

const rawCIDR = useStorage('ip-cidr-to-range:cidr', '192.168.1.0/24');

const result = computed(() => {
  const ips = expand(rawCIDR.value);
  if (!ips || !ips.length) {
    return undefined;
  }

  return { startIpAddress: ips.slice(0, 1)[0], endIpAddress: ips.slice(-1)[0] };
});

const cidrValidation = useValidation({
  source: rawCIDR,
  rules: [{ message: 'Invalid ipv4/6 CIDR', validator: cidr => isCidr(cidr) }],
});

const showResult = computed(() => cidrValidation.isValid && result.value !== undefined);
</script>

<template>
  <div>
    <c-input-text
      v-model:value="rawCIDR"
      label="IPv4/6 CIDR (ie, 1.0.0.0/23)"
      placeholder="IPv4/6 CIDR (ie, 1.0.0.0/23)"
      :validation="cidrValidation"
      clearable
    />

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
    </c-card>
  </div>
</template>
