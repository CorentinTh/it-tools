<script setup lang="ts">
import { merge, parse } from 'cidr-tools';
import { isIP, isIPv6 } from 'is-ip';
import { Exchange } from '@vicons/tabler';
import { stringifyIp } from 'ip-bigint';
import { useValidation } from '@/composable/validation';

const rawStartAddress = useStorage('ip-range-to-cidr:startAddress', '192.168.1.1');
const rawEndAddress = useStorage('ip-range-to-cidr:endAddress', '192.168.6.255');

const isReversed = ref<boolean>(false);
const isNotSameVersion = ref<boolean>(false);

const result = computed(() => {
  try {
    isNotSameVersion.value = isIPv6(rawEndAddress.value) !== isIPv6(rawStartAddress.value);
    isReversed.value = false;
    if (isNotSameVersion.value) {
      return [];
    }

    const startIp = parse(rawStartAddress.value).start;
    const endIp = parse(rawEndAddress.value).end;
    isReversed.value = startIp > endIp;
    if (isReversed.value) {
      return [];
    }

    const version = isIPv6(rawStartAddress.value) ? 6 : 4;
    const ipRangeLength = endIp - startIp + 1n;
    const allIps = new BigInt64Array(Number(ipRangeLength));
    let iterIp = startIp;
    for (let i = 0; i < ipRangeLength; i++) {
      allIps[i] = iterIp++;
    }

    return merge(Array.from(allIps, ip => stringifyIp({ number: ip, version })));
  }
  catch (e) {
    return [];
  }
});

const startIpValidation = useValidation({
  source: rawStartAddress,
  rules: [{ message: 'Invalid ipv4/6 address', validator: ip => isIP(ip) }],
});
const endIpValidation = useValidation({
  source: rawEndAddress,
  rules: [{ message: 'Invalid ipv4/6 address', validator: ip => isIP(ip) }],
});

const showResult = computed(() => endIpValidation.isValid && startIpValidation.isValid && result.value.length > 0);

function onSwitchStartEndClicked() {
  const tmpStart = rawStartAddress.value;
  rawStartAddress.value = rawEndAddress.value;
  rawEndAddress.value = tmpStart;
}
</script>

<template>
  <div>
    <n-grid cols="4" x-gap="12" mb-6 w-full>
      <n-gi span="2">
        <c-input-text
          v-model:value="rawStartAddress"
          label="Start address"
          placeholder="Start IPv4/6 address..."
          :validation="startIpValidation"
          clearable
        />
      </n-gi>
      <n-gi span="2">
        <c-input-text
          v-model:value="rawEndAddress"
          label="End address"
          placeholder="End IPv4/6 address..."
          :validation="endIpValidation"
          clearable
        />
      </n-gi>
    </n-grid>

    <c-card v-if="showResult" title="CIDR" data-test-id="result">
      <ul style="list-item-type: none">
        <li v-for="cidr in result" :key="cidr">
          {{ cidr }}
        </li>
      </ul>
    </c-card>
    <n-alert
      v-else-if="startIpValidation.isValid && endIpValidation.isValid && isReversed"
      title="Invalid combination of start and end IPv4/6 address"
      type="error"
    >
      <div my-3 op-70>
        The end IPv4/6 address is lower than the start IPv4/6 address. This is not valid and no result could be calculated.
        In the most cases the solution to solve this problem is to change start and end address.
      </div>

      <c-button @click="onSwitchStartEndClicked">
        <n-icon mr-2 :component="Exchange" depth="3" size="22" />
        Switch start and end IPv4/6 address
      </c-button>
    </n-alert>
    <n-alert
      v-else-if="isNotSameVersion"
      title="Invalid combination of IP version 4/6"
      type="error"
    >
      <div my-3 op-70>
        Start IP and End IP must be of same version: IPv4 or IPv6
      </div>
    </n-alert>
  </div>
</template>
