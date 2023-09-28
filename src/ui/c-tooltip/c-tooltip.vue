<script setup lang="ts">
const props = withDefaults(defineProps<{ tooltip?: string }>(), { tooltip: '' });
const { tooltip } = toRefs(props);

const targetRef = ref();
const isTargetHovered = useElementHover(targetRef);
</script>

<template>
  <div class="relative" inline-block>
    <div ref="targetRef">
      <slot />
    </div>

    <div
      v-if="tooltip || $slots.tooltip"
      class="absolute bottom-100% left-50% z-10 mb-5px whitespace-nowrap rounded bg-black px-12px py-6px text-sm text-white shadow-lg transition transition transition-duration-0.2s -translate-x-1/2"
      :class="{
        'op-0 scale-0': isTargetHovered === false,
        'op-100 scale-100': isTargetHovered,
      }"
    >
      <slot
        v-if="isTargetHovered"
        name="tooltip"
      >
        {{ tooltip }}
      </slot>
    </div>
  </div>
</template>
