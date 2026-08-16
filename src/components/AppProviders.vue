<script setup lang="ts">
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  NNotificationProvider,
  darkTheme,
} from 'naive-ui';
import { darkThemeOverrides, lightThemeOverrides } from '@/themes';
import { useStyleStore } from '@/stores/style.store';
import { useResilientStorage } from '@/composable/use-resilient-storage';

const styleStore = useStyleStore();
const theme = computed(() => (styleStore.isDarkTheme ? darkTheme : null));
const themeOverrides = computed(() => (styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides));
const { locale } = useI18n();

syncRef(locale, useResilientStorage('locale', locale));
</script>

<template>
  <div class="app-root" :class="{ 'app-root--dark': styleStore.isDarkTheme }">
    <NConfigProvider :theme="theme" :theme-overrides="themeOverrides">
      <NGlobalStyle />
      <NMessageProvider placement="bottom">
        <NNotificationProvider placement="bottom-right">
          <slot />
        </NNotificationProvider>
      </NMessageProvider>
    </NConfigProvider>
  </div>
</template>

<style>
.app-root {
  min-height: 100vh;
  color-scheme: light;
}

.app-root--dark {
  color-scheme: dark;
}

body {
  min-height: 100%;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}
</style>
