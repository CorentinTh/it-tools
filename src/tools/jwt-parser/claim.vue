<template>
  <n-space>
    <i>{{ claim }}</i>
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
import { get_claim_label } from './jwt-parser.service';

const props = defineProps({
  claim: {
    type: String,
    default: '',
  },
});

const label = computed(() => get_claim_label(props.claim ? props.claim : ''));
</script>

<style lang="less" scoped></style>
