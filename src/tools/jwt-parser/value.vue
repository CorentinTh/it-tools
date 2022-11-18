<template>
  <n-space>
    {{ value.value }}
    <i v-if="value.extension">({{ value.extension }})</i>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { parse_claim_value } from './jwt-parser.service';

const props = defineProps({
  claim: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
});

const value = computed(() => parse_claim_value(props.claim, props.value));
</script>

<style lang="less" scoped></style>
