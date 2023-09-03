<script lang="ts" setup>
import _ from 'lodash';
import type { CKeyValueListItems } from './c-key-value-list.types';

const props = withDefaults(defineProps<{ items?: CKeyValueListItems }>(), { items: () => [] });
const { items } = toRefs(props);

const formattedItems = computed(() => items.value.filter(item => !_.isNil(item.value) || !item.hideOnNil));
</script>

<template>
  <div my-5>
    <div v-for="item in formattedItems" :key="item.label" flex gap-2 py-1 class="c-key-value-list__item">
      <div flex-basis-180px text-right font-bold class="c-key-value-list__key">
        {{ item.label }}
      </div>

      <c-key-value-list-item :item="item" class="c-key-value-list__value" />
    </div>
  </div>
</template>
