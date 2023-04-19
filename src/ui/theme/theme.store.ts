import { defineStore } from 'pinia';

export const useThemeStore = defineStore('ui-theme', {
  state: () => ({
    themeType: useStorage<'dark' | 'light'>('ui-store:theme-type', 'dark') as Ref<'dark' | 'light'>,
  }),
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
