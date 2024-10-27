<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/src/modules/shared/style/cn';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <p :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </p>
</template>
