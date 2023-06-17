import { defineStore } from 'pinia';
import { useStyleStore } from '@/stores/style.store';

export const useThemeStore = defineStore('ui-theme', {
  state: () => {
    const styleStore = useStyleStore();
    return {
      themeType: styleStore.isDarkTheme ? 'dark' : 'light',
    };
  },
  getters: {
    isDarkTheme(): boolean {
      return this.themeType === 'dark';
    },
    isLightTheme(): boolean {
      return this.themeType === 'light';
    },
  },
  actions: {
    toggleTheme() {
      this.themeType = this.isDarkTheme ? 'light' : 'dark';
    },
  },
});
