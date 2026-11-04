<script lang="ts" setup>
import type { CKeyValueListItems } from './c-key-value-list.types';
import _ from 'lodash';

const props = withDefaults(defineProps<{ items?: CKeyValueListItems }>(), { items: () => [] });
const { items } = toRefs(props);

const formattedItems = computed(() => items.value.filter(item => !_.isNil(item.value) || !item.hideOnNil));
</script>

<template>
  <div flex flex-col gap-2>
    <div v-for="item in formattedItems" :key="item.label" class="c-key-value-list__item">
      <div class="c-key-value-list__key" text-13px lh-normal>
        {{ item.label }}
      </div>

      <c-key-value-list-item :item="item" class="c-key-value-list__value" font-bold lh-normal />
    </div>
  </div>
</template>
