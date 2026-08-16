<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { RouterLink, useRoute } from 'vue-router';
import MenuIconItem from './MenuIconItem.vue';
import type { Tool, ToolCategory } from '@/tools/tools.types';

const props = withDefaults(defineProps<{ toolsByCategory?: ToolCategory[] }>(), { toolsByCategory: () => [] });
const { toolsByCategory } = toRefs(props);
const route = useRoute();
const isStandalone = import.meta.env.STANDALONE;

const makeLabel = (tool: Tool) => () => h(RouterLink, { to: tool.path }, { default: () => tool.name });
const makeIcon = (tool: Tool) => () => h(MenuIconItem, { tool });

const collapsedCategories = isStandalone
  ? ref<Record<string, boolean>>({})
  : useStorage<Record<string, boolean>>(
    'menu-tool-option:collapsed-categories',
    {},
    undefined,
    {
      deep: true,
      serializer: {
        read: v => (v ? JSON.parse(v) : null),
        write: v => JSON.stringify(v),
      },
    },
  );

function toggleCategoryCollapse({ name }: { name: string }) {
  collapsedCategories.value[name] = !collapsedCategories.value[name];
}

const menuOptions = computed(() =>
  toolsByCategory.value.map(({ name, components }) => ({
    name,
    isCollapsed: collapsedCategories.value[name],
    tools: components.map(tool => ({
      label: makeLabel(tool),
      icon: makeIcon(tool),
      key: tool.path,
      tool,
    })),
  })),
);

const themeVars = useThemeVars();
</script>

<template>
  <div v-for="{ name, tools, isCollapsed } of menuOptions" :key="name">
    <div ml-6px mt-12px flex cursor-pointer items-center op-60 @click="toggleCategoryCollapse({ name })">
      <span :class="{ 'rotate-0': isCollapsed, 'rotate-90': !isCollapsed }" text-16px lh-1 op-50 transition-transform>
        <icon-mdi-chevron-right />
      </span>

      <span ml-8px text-13px>
        {{ name }}
      </span>
    </div>

    <n-collapse-transition :show="!isCollapsed">
      <div class="menu-wrapper">
        <div class="toggle-bar" @click="toggleCategoryCollapse({ name })" />

        <div v-if="isStandalone" class="standalone-menu" role="menu">
          <RouterLink
            v-for="{ key, tool } of tools"
            :key="key"
            :to="key"
            class="standalone-menu-item"
            :class="{ active: route.path === key }"
            role="menuitem"
          >
            <MenuIconItem :tool="tool" />
            <span>{{ tool.name }}</span>
          </RouterLink>
        </div>

        <n-menu
          v-else
          class="menu"
          :value="route.path"
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

<style scoped lang="less">
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

.standalone-menu {
  flex: 1;
  margin-bottom: 5px;
}

.standalone-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
  padding: 0 12px 0 8px;
  color: var(--n-item-text-color, inherit);
  border-radius: 3px;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
  }

  &.active {
    color: var(--n-primary-color, #8777ff);
    background: rgba(135, 119, 255, 0.15);
  }
}
</style>
