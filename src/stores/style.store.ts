import { useStorage, usePreferredDark } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';

export const useStyleStore = defineStore('style', {
  state: () => {
    const isDark = usePreferredDark();

    return {
      isDarkTheme: useStorage('useDarkTheme', isDark) as Ref<boolean>,
    };
  },
});
