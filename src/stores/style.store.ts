import { useDark, useMediaQuery, useToggle } from '@vueuse/core';
import { defineStore } from 'pinia';
import { type Ref, computed, ref, watch } from 'vue';
import { useResilientStorage } from '@/composable/use-resilient-storage';
import { resilientLocalStorage } from '@/utils/resilient-storage';

export const useStyleStore = defineStore('style', {
  state: () => {
    const isDarkTheme = useDark({ storage: resilientLocalStorage });
    if (import.meta.env.STANDALONE) {
      const requestedTheme = new URLSearchParams(window.location.search).get('theme');
      if (requestedTheme === 'dark' || requestedTheme === 'light') {
        isDarkTheme.value = requestedTheme === 'dark';
      }
    }
    const toggleDark = useToggle(isDarkTheme);
    const isSmallScreen = useMediaQuery('(max-width: 700px)');
    const desktopMenuCollapsed = useResilientStorage('isMenuCollapsed', false) as Ref<boolean>;
    const mobileMenuCollapsed = ref(true);
    const isMenuCollapsed = computed({
      get: () => isSmallScreen.value ? mobileMenuCollapsed.value : desktopMenuCollapsed.value,
      set: (value: boolean) => {
        if (isSmallScreen.value) {
          mobileMenuCollapsed.value = value;
        }
        else {
          desktopMenuCollapsed.value = value;
        }
      },
    });

    watch(isSmallScreen, (smallScreen) => {
      if (smallScreen) {
        mobileMenuCollapsed.value = true;
      }
    });

    return {
      isDarkTheme,
      toggleDark,
      isMenuCollapsed,
      isSmallScreen,
    };
  },
});
