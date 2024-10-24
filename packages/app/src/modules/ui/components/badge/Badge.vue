<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/src/modules/shared/style/cn'
import { type BadgeVariants, badgeVariants } from '.'

const props = defineProps<{
  variant?: BadgeVariants['variant']
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </div>
</template>
