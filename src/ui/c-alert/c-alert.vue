<script lang="ts" setup>
import { useTheme } from './c-alert.theme';

const props = withDefaults(defineProps<{ type?: 'warning' }>(), { type: 'warning' });
const { type } = toRefs(props);

const theme = useTheme();
const variantTheme = computed(() => theme.value[type.value]);
</script>

<template>
  <div class="c-alert" flex items-center b-rd-4px pa-5>
    <div class="c-alert--icon" mr-4 text-40px op-60>
      <slot name="icon">
        <component :is="variantTheme.icon" />
      </slot>
    </div>

    <div class="c-alert--content">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.c-alert {
  background-color: v-bind('variantTheme.backgroundColor');
  color: v-bind('variantTheme.textColor');
  font-size: inherit;
  line-height: 20px;
}
</style>
