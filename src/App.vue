<script setup lang="ts">
import { layouts } from './layouts';
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router'
import { darkThemeOverrides, lightThemeOverrides } from './themes'
import { darkTheme, NGlobalStyle, NMessageProvider } from 'naive-ui'
import { useStyleStore } from './stores/style.store';

const route = useRoute();
const layout = computed(() => route?.meta?.layout ?? layouts.base)
const styleStore = useStyleStore()

const theme = computed(() => styleStore.isDarkTheme ? darkTheme : null)
const themeOverrides = computed(() => styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides)
</script>

<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <n-global-style />
    <n-message-provider placement="bottom">
      <component :is="layout">
        <router-view />
      </component>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
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