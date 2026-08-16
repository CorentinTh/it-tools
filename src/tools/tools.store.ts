import { type MaybeRef, get } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { toolsByCategory as sourceToolsByCategory } from '@tool-registry';
import type { Tool, ToolCategory, ToolWithCategory } from './tools.types';
import { useResilientStorage } from '@/composable/use-resilient-storage';

export const useToolStore = defineStore('tools', () => {
  const favoriteToolsName = useResilientStorage('favoriteToolsName', []) as Ref<string[]>;
  const { t } = useI18n();

  const tools = computed<ToolWithCategory[]>(() => sourceToolsByCategory.flatMap(({ components, name: category }) => (
    components.map((tool) => {
      const toolI18nKey = tool.path.replace(/\//g, '');

      return ({
        ...tool,
        path: tool.path,
        name: t(`tools.${toolI18nKey}.title`, tool.name),
        description: t(`tools.${toolI18nKey}.description`, tool.description),
        category: t(`tools.categories.${category.toLowerCase()}`, category),
      });
    })
  )));

  const toolsByCategory = computed<ToolCategory[]>(() => {
    const grouped = new Map<string, ToolWithCategory[]>();
    for (const tool of tools.value) {
      const components = grouped.get(tool.category) ?? [];
      components.push(tool);
      grouped.set(tool.category, components);
    }
    return [...grouped].map(([name, components]) => ({ name, components }));
  });

  const favoriteTools = computed(() => {
    return favoriteToolsName.value
      .map(favoriteName => tools.value.find(({ name, path }) => name === favoriteName || path === favoriteName))
      .filter((tool): tool is ToolWithCategory => tool !== undefined);
  });

  return {
    tools,
    favoriteTools,
    toolsByCategory,
    newTools: computed(() => tools.value.filter(({ isNew }) => isNew)),

    addToolToFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      const toolPath = get(tool).path;
      if (toolPath) {
        favoriteToolsName.value.push(toolPath);
      }
    },

    removeToolFromFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      favoriteToolsName.value = favoriteToolsName.value.filter(name => get(tool).name !== name && get(tool).path !== name);
    },

    isToolFavorite({ tool }: { tool: MaybeRef<Tool> }) {
      return favoriteToolsName.value.includes(get(tool).name)
        || favoriteToolsName.value.includes(get(tool).path);
    },

    updateFavoriteTools(newOrder: ToolWithCategory[]) {
      favoriteToolsName.value = newOrder.map(tool => tool.path);
    },
  };
});
