<script lang="ts" setup>
import _ from 'lodash';
import type { CKeyValueListItems } from './c-key-value-list.types';

const props = withDefaults(defineProps<{ items?: CKeyValueListItems }>(), { items: () => [] });
const { items } = toRefs(props);

const formattedItems = computed(() => items.value.filter(item => !_.isNil(item.value) || !item.hideOnNil));
</script>

<template>
  <table border-collapse table-fixed>
    <tr v-for="item in formattedItems" :key="item.label">
      <td py-1 pr-2 text-right font-bold>
        {{ item.label }}
      </td>

      <td v-if="_.isArray(item.value)">
        <div v-for="value in item.value" :key="value">
          <c-text-copyable :value="value" :show-icon="item.showCopyButton ?? true" />
        </div>
      </td>
      <td v-else-if="_.isBoolean(item.value)">
        <c-text-copyable :value="item.value ? 'true' : 'false'" :displayed-value="item.value ? 'Yes' : 'No'" :show-icon="item.showCopyButton ?? true" />
      </td>
      <td v-else-if="_.isNumber(item.value)" font-mono>
        <c-text-copyable :value="String(item.value)" :show-icon="item.showCopyButton ?? true" />
      </td>
      <td v-else-if="_.isNil(item.value) || item.value === ''" op-70>
        {{ item.placeholder ?? 'N/A' }}
      </td>
      <td v-else>
        <c-text-copyable :value="item.value" :show-icon="item.showCopyButton ?? true" />
      </td>
    </tr>
  </table>
</template>
