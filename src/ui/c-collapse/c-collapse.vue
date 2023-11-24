<script lang="ts" setup>
const props = withDefaults(defineProps<{ title?: string }>(), { title: '' });
const { title } = toRefs(props);

const isCollapsed = ref(true);
</script>

<template>
  <div>
    <div flex cursor-pointer items-center @click="isCollapsed = !isCollapsed">
      <icon-mdi-triangle-down :class="{ 'transform-rotate--90': isCollapsed }" op-50 transition />

      <slot name="title">
        <span class="ml-2" font-bold>{{ title }}</span>
      </slot>
    </div>

    <div
      v-show="!isCollapsed"
      mt-2
    >
      <slot />
    </div>
  </div>
</template>
