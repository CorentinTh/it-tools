<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/src/modules/shared/style/cn';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
</script>

<template>
  <div
    :class="
      cn('flex flex-col gap-y-2 text-center sm:text-left', props.class)
    "
  >
    <slot />
  </div>
</template>
