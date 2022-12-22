<script lang="ts" setup>
import type { Tool } from '@/tools/tools.types';
import { toRefs } from 'vue';

const props = defineProps<{ tool: Tool }>();
const { tool } = toRefs(props);
</script>

<template>
  <div class="search-bar-item">
    <n-icon class="icon" :component="tool.icon" />

    <div>
      <div class="name">{{ tool.name }}</div>
      <div class="description">{{ tool.description }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.search-bar-item {
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .icon {
    font-size: 30px;
    margin-right: 10px;
    opacity: 0.7;
  }

  .name {
    font-weight: bold;
    font-size: 15px;
    line-height: 1;
    margin-bottom: 5px;
  }

  .description {
    opacity: 0.7;
    line-height: 1;
  }
}
</style>
