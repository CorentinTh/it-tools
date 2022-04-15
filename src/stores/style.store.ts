import { useMediaQuery, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';

export const useStyleStore = defineStore('style', {
  state: () => ({
    isDarkTheme: useStorage('isDarkTheme', true) as Ref<boolean>,
    isMenuCollapsed: useStorage('isMenuCollapsed', false) as Ref<boolean>,
    isSmallScreen: useMediaQuery('(max-width: 700px)'),
  }),
});
