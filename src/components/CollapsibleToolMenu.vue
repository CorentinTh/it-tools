<template>
  <div v-for="{ name, tools, isCollapsed } of menuOptions" :key="name">
    <n-text tag="div" depth="3" class="category-name" @click="toggleCategoryCollapse({ name })">
      <n-icon :component="ChevronRight" :class="{ rotated: isCollapsed }" size="16" />

      <span>
        {{ name }}
      </span>
    </n-text>

    <n-collapse-transition :show="!isCollapsed">
      <div class="menu-wrapper">
        <div class="toggle-bar" @click="toggleCategoryCollapse({ name })" />

        <n-menu
          class="menu"
          :value="(route.name as string)"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="tools"
          :indent="8"
          :default-expand-all="true"
        />
      </div>
    </n-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import type { Tool, ToolCategory } from '@/tools/tools.types';
import { ChevronRight } from '@vicons/tabler';
import { useStorage } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { toRefs, computed, h } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import MenuIconItem from './MenuIconItem.vue';

const props = withDefaults(defineProps<{ toolsByCategory?: ToolCategory[] }>(), { toolsByCategory: () => [] });
const { toolsByCategory } = toRefs(props);
const route = useRoute();

const makeLabel = (tool: Tool) => () => h(RouterLink, { to: tool.path }, { default: () => tool.name });
const makeIcon = (tool: Tool) => () => h(MenuIconItem, { tool });

const collapsedCategories = useStorage<Record<string, boolean>>(
  'menu-tool-option:collapsed-categories',
  {},
  undefined,
  {
    deep: true,
    serializer: {
      read: (v) => (v ? JSON.parse(v) : null),
      write: (v) => JSON.stringify(v),
    },
  },
);

function toggleCategoryCollapse({ name }: { name: string }) {
  collapsedCategories.value[name] = !collapsedCategories.value[name];
}

const menuOptions = computed(() =>
  toolsByCategory.value.map(({ name, components }) => ({
    name: name,
    isCollapsed: collapsedCategories.value[name],
    tools: components.map((tool) => ({
      label: makeLabel(tool),
      icon: makeIcon(tool),
      key: tool.name,
    })),
  })),
);

const themeVars = useThemeVars();
</script>

<style scoped lang="less">
.category-name {
  font-size: 0.93em;
  padding: 12px 0 0px 0;
  cursor: pointer;

  display: flex;
  flex-direction: row;
  align-items: center;
  .n-icon {
    transition: transform ease 0.5s;
    transform: rotate(90deg);
    margin: 0 10px 0 7px;
    opacity: 0.5;

    &.rotated {
      transform: rotate(0deg);
    }
  }
}

.menu-wrapper {
  display: flex;
  flex-direction: row;
  .menu {
    flex: 1;
    margin-bottom: 5px;

    ::v-deep(.n-menu-item-content::before) {
      left: 0;
      right: 13px;
    }
  }

  .toggle-bar {
    width: 24px;
    opacity: 0.1;
    transition: opacity ease 0.2s;
    position: relative;
    cursor: pointer;

    &::before {
      width: 2px;
      height: 100%;
      content: ' ';
      background-color: v-bind('themeVars.textColor3');
      border-radius: 2px;
      position: absolute;
      top: 0;
      left: 14px;
    }

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
