<script setup lang="ts">
import type { Component } from 'vue';

const props = defineProps<{ icon: Component; title: string; action: () => void; isActive?: () => boolean }>();
const { icon, title, action, isActive } = toRefs(props);
</script>

<template>
  <c-tooltip :tooltip="title">
    <c-button circle variant="text" :type="isActive?.() ? 'primary' : 'default'" @click="action">
      <n-icon :component="icon" />
    </c-button>
  </c-tooltip>
</template>
