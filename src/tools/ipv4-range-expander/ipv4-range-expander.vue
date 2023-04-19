<template>
  <div>
    <n-space item-style="flex:1 1 0">
      <div>
        <n-space item-style="flex:1 1 0">
          <n-form-item label="Start address" v-bind="validationAttrsStart">
            <n-input v-model:value="rawStartAddress" placeholder="Start IPv4 address..." />
          </n-form-item>
          <n-form-item label="End address" v-bind="validationAttrsEnd">
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
      </div>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useValidation } from '@/composable/validation';
import { isValidIpv4 } from '../ipv4-address-converter/ipv4-address-converter.service';
import { calculateCidr, Ipv4RangeExpanderResult } from './ipv4-range-expander.service';
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

const showResult = computed(
  () =>
    validationAttrsStart.validationStatus !== 'error' &&
    validationAttrsEnd.validationStatus !== 'error' &&
    result.value !== undefined,
);
const { attrs: validationAttrsStart } = useValidation({
  source: rawStartAddress,
  rules: [{ message: 'Invalid ipv4 address', validator: (ip) => isValidIpv4({ ip }) }],
});

const { attrs: validationAttrsEnd } = useValidation({
  source: rawEndAddress,
  rules: [{ message: 'Invalid ipv4 address', validator: (ip) => isValidIpv4({ ip }) }],
});
</script>

<style lang="less" scoped></style>
