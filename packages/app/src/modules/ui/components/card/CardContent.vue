<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/src/modules/shared/style/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('p-6 pt-0', props.class)">
    <slot />
  </div>
</template>
