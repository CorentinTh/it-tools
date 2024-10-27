<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/src/modules/shared/style/cn';
import { toggleVariants } from '@/src/modules/ui/components/toggle';
import { omit } from 'lodash-es';
import { ToggleGroupItem, type ToggleGroupItemProps, useForwardProps } from 'radix-vue';
import { computed, type HTMLAttributes, inject } from 'vue';

type ToggleGroupVariants = VariantProps<typeof toggleVariants>;

const props = defineProps<ToggleGroupItemProps & {
  class?: HTMLAttributes['class'];
  variant?: ToggleGroupVariants['variant'];
  size?: ToggleGroupVariants['size'];
}>();

const context = inject<ToggleGroupVariants>('toggleGroup');

const delegatedProps = computed(() => omit(props, ['class', 'variant', 'size']));

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <ToggleGroupItem
    v-bind="forwardedProps" :class="cn(toggleVariants({
      variant: context?.variant || variant,
      size: context?.size || size,
    }), props.class)"
  >
    <slot />
  </ToggleGroupItem>
</template>
