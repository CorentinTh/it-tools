<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { substractCIDRs } from './ip-include-exclude.service';
import SpanCopyable from '@/components/SpanCopyable.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const allowedRanges = useStorage('ip-inc-exc:allow', '192.168.0.1/24'); // NOSONAR
const disallowedRanges = useStorage('ip-inc-exc:disallow', '192.168.0.6'); // NOSONAR

const result = computed(() => substractCIDRs({
  allowedRanges: allowedRanges.value, disallowedRanges: disallowedRanges.value,
}));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="allowedRanges"
      label="AllowedIPs (IPv4/6 CIDR/Range/Mask/Wildcard)"
      placeholder="An IPv4/6 CIDR/Range/Mask/Wildcard..."
      mb-4
    />

    <c-input-text
      v-model:value="disallowedRanges"
      label="DisallowedIPs (IPv4/6 CIDR/Range/Mask/Wildcard)"
      placeholder="An IPv4/6 CIDR/Range/Mask/Wildcard..."
      mb-4
    />

    <n-divider />

    <c-alert v-if="result.error">
      {{ result.error }}
    </c-alert>

    <div v-if="!result.error">
      <n-form-item label="Final AllowedIPs:">
        <TextareaCopyable :value="result.allowedCIDRs.join(', ')" />
      </n-form-item>

      <n-divider />

      <c-card title="Allowed Subnets">
        <n-table>
          <tbody>
            <tr v-for="{ cidr, start, end } in result.allowedSubnets" :key="cidr">
              <td font-bold>
                <SpanCopyable :value="cidr" />
              </td>
              <td>
                <SpanCopyable :value="start" />
              </td>
              <td>
                <SpanCopyable :value="end" />
              </td>
            </tr>
          </tbody>
        </n-table>
      </c-card>
      <c-card title="Disallowed Subnets">
        <n-table>
          <tbody>
            <tr v-for="{ cidr, start, end } in result.disallowedSubnets" :key="cidr">
              <td font-bold>
                <SpanCopyable :value="cidr" />
              </td>
              <td>
                <SpanCopyable :value="start" />
              </td>
              <td>
                <SpanCopyable :value="end" />
              </td>
            </tr>
          </tbody>
        </n-table>
      </c-card>
    </div>
  </div>
</template>
