<template>
  <component
    :is="tag"
    :href="href ?? to"
    class="c-button"
    :class="{ disabled, round, circle }"
    :to="to"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';
import { useTheme } from './c-button.theme';
import { useAppTheme } from '../theme/themes';

const props = withDefaults(
  defineProps<{
    type?: 'default' | 'primary';
    variant?: 'basic' | 'text';
    disabled?: boolean;
    round?: boolean;
    circle?: boolean;
    href?: string;
    to?: RouteLocationRaw;
  }>(),
  {
    type: 'default',
    variant: 'basic',
    disabled: false,
    round: false,
    circle: false,
    href: undefined,
    to: undefined,
  },
);
const { variant, disabled, round, circle, href, type, to } = toRefs(props);

const emits = defineEmits(['click']);

function handleClick(event: MouseEvent) {
  if (!disabled.value) {
    emits('click', event);
  }
}

const theme = useTheme();
const variantTheme = computed(() => theme.value[variant.value][type.value]);
const tag = computed(() => {
  if (href.value) {
    return 'a';
  }
  if (to.value) {
    return 'router-link';
  }
  return 'button';
});
const appTheme = useAppTheme();
</script>

<style lang="less" scoped>
.c-button {
  line-height: 1;
  font-family: inherit;
  font-size: inherit;
  border: none;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  height: 34px;
  font-weight: 400;
  color: v-bind('variantTheme.textColor');
  padding: 0 14px;
  border-radius: 4px;
  transition: background-color cubic-bezier(0.4, 0, 0.2, 1) 0.3s;

  background-color: v-bind('variantTheme.backgroundColor');
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  // outline-offset: 1px;
  &.round {
    border-radius: 100px;
  }

  &.circle {
    border-radius: 40px;
    width: 34px;
  }

  &:not(.disabled) {
    &:hover {
      background-color: v-bind('variantTheme.hover.backgroundColor');
    }

    &:active {
      background-color: v-bind('variantTheme.pressed.backgroundColor');
    }
  }

  &:focus {
    outline: 1px solid v-bind('appTheme.primary.color');
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
