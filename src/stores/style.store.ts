import { useDark, useMediaQuery, useStorage, useToggle } from '@vueuse/core';
import { defineStore } from 'pinia';
import { type Ref, computed, ref, watch } from 'vue';

export const useStyleStore = defineStore('style', {
  state: () => {
    const isDarkTheme = useDark();
    const toggleDark = useToggle(isDarkTheme);
    const isSmallScreen = useMediaQuery('(max-width: 700px)');
    const desktopMenuCollapsed = useStorage('isMenuCollapsed', false) as Ref<boolean>;
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
