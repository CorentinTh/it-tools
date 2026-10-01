<script setup lang="ts">
import { describeIpv6 } from './ipv6-subnet-calculator.models';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const input = ref('2001:db8:1234:5678::1/48');

const info = computed(() => withDefaultOnError(() => describeIpv6(input.value), undefined));

const validation = useValidation({
  source: input,
  rules: [
    {
      validator: value => value.trim() === '' || isNotThrowing(() => describeIpv6(value)),
      message: 'Invalid IPv6 address or prefix (e.g. 2001:db8::1/48)',
    },
  ],
});

const rows = computed(() =>
  info.value
    ? [
        { label: 'Expanded address', value: info.value.expanded },
        { label: 'Compressed (RFC 5952)', value: info.value.compressed },
        { label: 'Type', value: info.value.type },
        { label: 'Scope', value: info.value.scope },
        { label: 'Network', value: info.value.network },
        { label: 'First address', value: info.value.firstAddress },
        { label: 'Last address', value: info.value.lastAddress },
        { label: 'Total addresses', value: info.value.totalAddresses },
        { label: 'Netmask', value: info.value.mask },
      ]
    : [],
);
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto;">
    <c-card mb-3>
      <c-input-text
        v-model:value="input"
        label="IPv6 address or CIDR"
        placeholder="e.g. 2001:db8:1234:5678::1/48"
        :validation="validation"
        raw-text
        mb-2
      />
    </c-card>

    <c-card v-if="info && validation.isValid">
      <n-table>
        <tbody>
          <tr v-for="row of rows" :key="row.label">
            <td class="labels">{{ row.label }}:</td>
            <td style="word-break: break-all;">
              {{ row.value }}
            </td>
          </tr>
        </tbody>
      </n-table>
    </c-card>
  </div>
</template>

<style scoped lang="less">
.labels {
  width: 220px;
  font-weight: bold;
}
</style>
