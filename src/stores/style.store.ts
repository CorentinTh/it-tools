import { useMediaQuery, useStorage, whenever } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';

export const useStyleStore = defineStore('style', {
  state: () => {
    const isDarkTheme = useStorage('isDarkTheme', true) as Ref<boolean>;
    const isSmallScreen = useMediaQuery('(max-width: 700px)');
    const isMenuCollapsed = useStorage('isMenuCollapsed', !isSmallScreen.value) as Ref<boolean>;

    whenever(
      () => !isSmallScreen.value,
      () => (isMenuCollapsed.value = false),
    );

    whenever(
      () => isSmallScreen.value,
      () => (isMenuCollapsed.value = true),
    );

    return {
      isDarkTheme,
      isMenuCollapsed,
      isSmallScreen,
    };
  },
});
