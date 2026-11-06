<script setup lang="ts">
const props = withDefaults(defineProps<{ tooltip?: string; position?: 'top' | 'bottom' | 'left' | 'right' }>(), {
  tooltip: undefined,
  position: 'top',
});
const { tooltip, position } = toRefs(props);

const targetRef = ref();
const isTargetHovered = useElementHover(targetRef);
</script>

<template>
  <div relative inline-block>
    <div ref="targetRef">
      <slot />
    </div>

    <div
      v-if="tooltip || $slots.tooltip"
      class="absolute z-10 whitespace-nowrap rounded bg-black px-12px py-6px text-sm text-white shadow-lg transition transition transition-duration-0.2s"
      :class="{
        'op-0 scale-0': isTargetHovered === false,
        'op-100 scale-100': isTargetHovered,
        'bottom-100% left-50% -translate-x-1/2 mb-5px': position === 'top',
        'top-100% left-50% -translate-x-1/2 mt-5px': position === 'bottom',
        'right-100% top-50% -translate-y-1/2 mr-5px': position === 'left',
        'left-100% top-50% -translate-y-1/2 ml-5px': position === 'right',
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
