<script setup lang="ts">
import { cn } from '@/src/modules/shared/style/cn';
import { ChevronUpIcon } from '@radix-icons/vue';
import { SelectScrollUpButton, type SelectScrollUpButtonProps, useForwardProps } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<SelectScrollUpButtonProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollUpButton v-bind="forwardedProps" :class="cn('flex cursor-default items-center justify-center py-1', props.class)">
    <slot>
      <ChevronUpIcon />
    </slot>
  </SelectScrollUpButton>
</template>
