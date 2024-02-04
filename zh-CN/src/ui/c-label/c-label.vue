<script lang="ts" setup>
import { toRefs } from 'vue';
import type { CLabelProps } from './c-label.types';

const props = withDefaults(defineProps<CLabelProps>(), { label: undefined, labelAlign: 'left', labelFor: undefined, labelPosition: 'top', labelWidth: 'auto' });
const { label, labelAlign, labelFor, labelPosition, labelWidth } = toRefs(props);
</script>

<template>
  <div
    :class="{
      'flex-col': labelPosition === 'top',
      'flex-row': labelPosition === 'left',
    }"
    flex
    items-baseline
  >
    <label
      v-if="label" :for="labelFor" :style="{ flex: `0 0 ${labelWidth}` }"
      mb-5px
      pr-12px
      :class="{
        'text-left': labelAlign === 'left',
        'text-center': labelAlign === 'center',
        'text-right': labelAlign === 'right',
      }"
    >
      {{ label }}
    </label>
    <slot />
  </div>
</template>
