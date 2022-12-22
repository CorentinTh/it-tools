import { get, useStorage, type MaybeRef } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { toolsWithCategory } from './index';
import type { Tool, ToolWithCategory } from './tools.types';

export const useToolStore = defineStore('tools', {
  state: () => ({
    favoriteToolsName: useStorage('favoriteToolsName', []) as Ref<string[]>,
  }),
  getters: {
    favoriteTools(state) {
      return state.favoriteToolsName
        .map((favoriteName) => toolsWithCategory.find(({ name }) => name === favoriteName))
        .filter(Boolean) as ToolWithCategory[]; // cast because .filter(Boolean) does not remove undefined from type
    },

    notFavoriteTools(state): ToolWithCategory[] {
      return toolsWithCategory.filter((tool) => !state.favoriteToolsName.includes(tool.name));
    },

    tools(): ToolWithCategory[] {
      return toolsWithCategory;
    },

    newTools(): ToolWithCategory[] {
      return this.tools.filter(({ isNew }) => isNew);
    },
  },

  actions: {
    addToolToFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      this.favoriteToolsName.push(get(tool).name);
    },

    removeToolFromFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      this.favoriteToolsName = this.favoriteToolsName.filter((name) => get(tool).name !== name);
    },

    isToolFavorite({ tool }: { tool: MaybeRef<Tool> }) {
      return this.favoriteToolsName.includes(get(tool).name);
    },
  },
});
