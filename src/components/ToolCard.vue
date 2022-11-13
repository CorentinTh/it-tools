<template>
  <router-link :to="tool.path">
    <n-card class="tool-card">
      <n-space justify="space-between" align="center">
        <n-icon class="icon" size="40" :component="tool.icon" />
        <n-tag
          v-if="tool.isNew"
          size="small"
          class="badge-new"
          round
          type="success"
          :bordered="false"
          :color="{ color: theme.primaryColor, textColor: theme.tagColor }"
        >
          New
        </n-tag>
      </n-space>
      <n-h3 class="title">
        <n-ellipsis>{{ tool.name }}</n-ellipsis>
      </n-h3>

      <div class="description">
        <n-ellipsis :line-clamp="2" :tooltip="false">
          {{ tool.description }}
        </n-ellipsis>
      </div>
    </n-card>
  </router-link>
</template>

<script setup lang="ts">
import type { ITool } from '@/tools/tool';
import { useThemeVars } from 'naive-ui';
import { toRefs } from 'vue';

const props = defineProps<{ tool: ITool & { category: string } }>();
const { tool } = toRefs(props);
const theme = useThemeVars();
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}

.tool-card {
  &:hover {
    border-color: var(--n-color-target);
  }

  .icon {
    opacity: 0.6;
    color: #ffffff;
  }

  .title {
    margin: 5px 0;
  }

  .description {
    opacity: 0.6;
    color: #ffffff;
    margin: 5px 0;
  }
}
</style>
