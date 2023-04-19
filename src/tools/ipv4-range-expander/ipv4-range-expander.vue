<template>
  <div>
    <n-space item-style="flex:1 1 0">
      <div>
        <n-space item-style="flex:1 1 0">
          <n-form-item label="Start address" v-bind="startIpValidation.attrs">
            <n-input v-model:value="rawStartAddress" placeholder="Start IPv4 address..." />
          </n-form-item>
          <n-form-item label="End address" v-bind="endIpValidation.attrs">
            <n-input v-model:value="rawEndAddress" placeholder="End IPv4 address..." />
          </n-form-item>
        </n-space>

        <n-table v-if="showResult" data-test-id="result">
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">old value</th>
              <th scope="col">new value</th>
            </tr>
          </thead>
          <tbody>
            <result-row
              v-for="{ label, getOldValue, getNewValue } in calculatedValues"
              :key="label"
              :label="label"
              :old-value="getOldValue(result)"
              :new-value="getNewValue(result)"
            />
          </tbody>
        </n-table>
        <n-alert
          v-else-if="startIpValidation.isValid && endIpValidation.isValid"
          title="Invalid combination of start and end IPv4 address"
          type="error"
        >
          <n-space vertical>
            <n-text depth="3">
              The end IPv4 address is lower than the start IPv4 address. This is not valid and no result could be
              calculated. In the most cases the solution to solve this problem is to change start and end address.
            </n-text>
            <c-button @click="onSwitchStartEndClicked">
              <n-icon mr-2 :component="Exchange" depth="3" size="22" />
              Switch start and end IPv4 address
            </c-button>
          </n-space>
        </n-alert>
      </div>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useValidation } from '@/composable/validation';
import { Exchange } from '@vicons/tabler';
import { isValidIpv4 } from '../ipv4-address-converter/ipv4-address-converter.service';
import type { Ipv4RangeExpanderResult } from './ipv4-range-expander.types';
import { calculateCidr } from './ipv4-range-expander.service';
import ResultRow from './result-row.vue';

const rawStartAddress = useStorage('ipv4-range-expander:startAddress', '192.168.1.1');
const rawEndAddress = useStorage('ipv4-range-expander:endAddress', '192.168.6.255');

const result = computed(() => calculateCidr({ startIp: rawStartAddress.value, endIp: rawEndAddress.value }));

const calculatedValues: {
  label: string;
  getOldValue: (result: Ipv4RangeExpanderResult | undefined) => string | undefined;
  getNewValue: (result: Ipv4RangeExpanderResult | undefined) => string | undefined;
}[] = [
  {
    label: 'Start address',
    getOldValue: () => rawStartAddress.value,
    getNewValue: (result) => result?.newStart,
  },
  {
    label: 'End address',
    getOldValue: () => rawEndAddress.value,
    getNewValue: (result) => result?.newEnd,
  },
  {
    label: 'Addresses in range',
    getOldValue: (result) => result?.oldSize?.toLocaleString(),
    getNewValue: (result) => result?.newSize?.toLocaleString(),
  },
  {
    label: 'CIDR',
    getOldValue: () => '',
    getNewValue: (result) => result?.newCidr,
  },
];

const showResult = computed(() => endIpValidation.isValid && startIpValidation.isValid && result.value !== undefined);
const startIpValidation = useValidation({
  source: rawStartAddress,
  rules: [{ message: 'Invalid ipv4 address', validator: (ip) => isValidIpv4({ ip }) }],
});
const endIpValidation = useValidation({
  source: rawEndAddress,
  rules: [{ message: 'Invalid ipv4 address', validator: (ip) => isValidIpv4({ ip }) }],
});

function onSwitchStartEndClicked() {
  const tmpStart = rawStartAddress.value;
  rawStartAddress.value = rawEndAddress.value;
  rawEndAddress.value = tmpStart;
}
</script>

<style lang="less" scoped></style>
