<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{ tool: Tool }>();
const { tool } = toRefs(props);

const theme = useThemeVars();
</script>

<template>
  <div class="menu-icon-item">
    <n-icon :component="tool.icon" />
    <div v-if="tool.isNew" class="badge" />
  </div>
</template>

<style lang="less" scoped>
.menu-icon-item {
  position: relative;

  .badge {
    position: absolute;
    background-color: v-bind('theme.primaryColor');
    border-radius: 10px;
    line-height: 1;
    top: 3px;
    left: -6px;
    font-size: 10px;

    height: 6px;
    width: 6px;
  }
}
</style>
