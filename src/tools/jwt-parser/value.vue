<template>
  <n-space>
    {{ value.value }}
    <em v-if="value.extension">({{ value.extension }})</em>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { parseClaimValue } from './jwt-parser.service';

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

const value = computed(() => parseClaimValue(props.claim, props.value));
</script>
