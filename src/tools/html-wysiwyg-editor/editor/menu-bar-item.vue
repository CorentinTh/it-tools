<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button circle quaternary :type="isActive?.() ? 'primary' : 'default'" @click="action">
        <template #icon>
          <n-icon :component="icon" />
        </template>
      </n-button>
    </template>

    {{ title }}
  </n-tooltip>
</template>

<script setup lang="ts">
import { toRefs, type Component } from 'vue';

const props = defineProps<{ icon: Component; title: string; action: () => void; isActive?: () => boolean }>();
const { icon, title, action, isActive } = toRefs(props);
</script>

<style scoped></style>
