<template>
  <n-space>
    <em>{{ claim }}</em>
    <span v-if="label.label !== claim">
      <n-popover placement="right" trigger="hover">
        <template #trigger>
          <n-icon :component="InfoCircle" trigger />
        </template>
        {{ label.label }}
        <template v-if="label.ref !== ''" #footer> {{ label.ref }} </template>
      </n-popover>
    </span>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoCircle } from '@vicons/tabler';
import { getClaimLabel } from './jwt-parser.service';

const props = defineProps({
  claim: {
    type: String,
    default: '',
  },
});

const label = computed(() => getClaimLabel(props.claim ? props.claim : ''));
</script>
