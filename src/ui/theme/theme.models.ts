import { useThemeStore } from './theme.store';

export { defineThemes };

function defineThemes<Theme>(themes: { light: Theme; dark: Theme }) {
  return {
    themes,
    useTheme() {
      const themeStore = useThemeStore();
      return computed(() => themes[themeStore.themeType]);
    },
  };
}
