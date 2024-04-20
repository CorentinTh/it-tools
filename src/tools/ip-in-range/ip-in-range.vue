<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { Check as CheckIcon, LetterX as CrossIcon } from '@vicons/tabler';
import { getMatch } from 'ip-matching';
import { withDefaultOnError } from '@/utils/defaults';
import { isNotThrowing } from '@/utils/boolean';
import SpanCopyable from '@/components/SpanCopyable.vue';

const range = useStorage('ip-in-range:range', '192.168.0.1/24'); // NOSONAR
const ip = useStorage('ip-in-range:ip', '192.168.0.1'); // NOSONAR

const match = computed(() => withDefaultOnError(() => getMatch(range.value), undefined));
const subnets = computed(() => {
  return (match.value?.convertToMasks() || []).map((mask) => {
    const subnet = mask.convertToSubnet();
    if (!subnet) {
      return { cidr: '', start: '', end: '' };
    }
    return {
      cidr: subnet.toString(),
      start: subnet.getFirst().toString(),
      end: subnet.getLast().toString(),
    };
  }).filter(subnet => subnet.cidr !== '');
});
const ipIsInMatch = computed(() => match.value?.matches(ip.value));

const ipValidationRules = [
  {
    message: 'We cannot parse this CIDR/IP Range/Mask/Wildcard, check the format',
    validator: (value: string) => isNotThrowing(() => getMatch(value)) && getMatch(range.value),
  },
];
</script>

<template>
  <div>
    <c-input-text
      v-model:value="range"
      label="An IPv4/6 CIDR/Range/Mask/Wildcard"
      placeholder="The ipv4/6 CIDR..."
      :validation-rules="ipValidationRules"
      mb-4
    />

    <c-input-text
      v-model:value="ip"
      label="An IPv4/6 address"
      placeholder="The ipv4/6 address..."
      :validation-rules="ipValidationRules"
      mb-4
    />

    <n-divider />

    <div flex justify-center>
      <span v-if="ipIsInMatch">
        <n-icon color="green">
          <CheckIcon />
        </n-icon>
        Match
      </span>
      <span v-else>
        <n-icon color="red">
          <CrossIcon />
        </n-icon>
        Not Match
      </span>
    </div>

    <n-divider />

    <c-card title="Subnets">
      <n-table>
        <tbody>
          <tr v-for="{ cidr, start, end } in subnets" :key="cidr">
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
</template>
