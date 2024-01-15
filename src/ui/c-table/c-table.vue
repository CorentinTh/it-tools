<script lang="ts" setup>
import _ from 'lodash';
import type { HeaderConfiguration } from './c-table.types';

const props = withDefaults(defineProps<{ data?: Record<string, unknown>[]; headers?: HeaderConfiguration ; hideHeaders?: boolean; description?: string }>(), { data: () => [], headers: undefined, hideHeaders: false, description: 'Data table' });
const { data, headers: rawHeaders, hideHeaders } = toRefs(props);

const headers = computed(() => {
  if (rawHeaders.value) {
    if (Array.isArray(rawHeaders.value)) {
      return rawHeaders.value.map((value) => {
        if (typeof value === 'string') {
          return { key: value, label: value };
        }

        const { key, label } = value;

        return {
          key,
          label: label ?? key,
        };
      });
    }

    return _.map(rawHeaders.value, (value, key) => ({
      key, label: value,
    }));
  }

  return _.chain(data.value)
    .map(row => Object.keys(row))
    .flatten()
    .uniq()
    .map(key => ({ key, label: key }))
    .value();
});
</script>

<template>
  <div class="relative overflow-x-auto rounded">
    <table class="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400" role="table" :aria-label="description">
      <thead v-if="!hideHeaders" class="bg-#ffffff uppercase text-gray-700 dark:bg-#333333 dark:text-gray-400" border-b="1px solid dark:transparent #efeff5">
        <tr>
          <th v-for="header in headers" :key="header.key" scope="col" class="px-6 py-3 text-xs">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in data" :key="i" border-b="1px solid dark:#282828 #efeff5" class="bg-white dark:bg-#232323"
          :class="{
            'important:border-b-none': i === data.length - 1,
          }"
        >
          <td v-for="header in headers" :key="header.key" class="px-6 py-4">
            <slot :name="header.key" :row="row" :headers="headers" :value="row[header.key]">
              {{ row[header.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
