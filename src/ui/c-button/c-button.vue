<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';
import { useAppTheme } from '../theme/themes';
import { useTheme } from './c-button.theme';

const props = withDefaults(
  defineProps<{
    type?: 'default' | 'primary' | 'warning' | 'error'
    variant?: 'basic' | 'text'
    disabled?: boolean
    round?: boolean
    circle?: boolean
    href?: string
    to?: RouteLocationRaw
    size?: 'small' | 'medium' | 'large'
    nativeType?: 'button' | 'submit' | 'reset'
  }>(),
  {
    type: 'default',
    variant: 'basic',
    disabled: false,
    round: false,
    circle: false,
    href: undefined,
    to: undefined,
    size: 'medium',
    nativeType: 'button',
  },
);
const emits = defineEmits(['click']);

const { variant, disabled, round, circle, href, type, to, size: sizeName, nativeType } = toRefs(props);

function preventDisabledActivation(event: MouseEvent) {
  if (disabled.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}

function handleClick(event: MouseEvent) {
  if (disabled.value) {
    preventDisabledActivation(event);
    return;
  }

  emits('click', event);
}

const theme = useTheme();
const variantTheme = computed(() => theme.value[variant.value][type.value]);
const tag = computed(() => {
  if (href.value) {
    return 'a';
  }
  if (to.value) {
    return disabled.value ? 'a' : 'router-link';
  }
  return 'button';
});
const isNativeButton = computed(() => tag.value === 'button');
const isLink = computed(() => !isNativeButton.value);
const navigationProps = computed(() => {
  if (href.value && !disabled.value) {
    return { href: href.value };
  }
  if (to.value && !disabled.value) {
    return { to: to.value };
  }

  return {};
});
const appTheme = useAppTheme();

const size = computed(() => theme.value.size[sizeName.value]);
</script>

<template>
  <component
    :is="tag"
    v-bind="navigationProps"
    class="c-button"
    :class="{ disabled, round, circle }"
    :disabled="isNativeButton ? disabled : undefined"
    :type="isNativeButton ? nativeType : undefined"
    :role="isLink && disabled ? 'link' : undefined"
    :aria-disabled="isLink && disabled ? 'true' : undefined"
    :tabindex="isLink && disabled ? -1 : undefined"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<style lang="less" scoped>
.c-button {
  line-height: 1;
  font-family: inherit;
  font-size: v-bind('size.fontSize');
  border: none;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  height: v-bind('size.width');
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
    border-radius: v-bind('size.width');
    width: v-bind('size.width');
    padding: 0;
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
