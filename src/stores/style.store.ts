import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';

export const useStyleStore = defineStore('style', {
  state: () => ({
    isDarkTheme: useStorage('useDarkTheme', false) as Ref<boolean>,
  }),
});
