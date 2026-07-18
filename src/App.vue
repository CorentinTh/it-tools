<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NGlobalStyle, NMessageProvider, NNotificationProvider, darkTheme } from 'naive-ui';
import { darkThemeOverrides, lightThemeOverrides } from './themes';
import BaseLayout from './layouts/base.layout.vue';
import ToolLayout from './layouts/tool.layout.vue';
import OfflineRouteUnavailable from './modules/pwa/OfflineRouteUnavailable.vue';
import { offlineRouteFailure } from './modules/pwa/offline-route-recovery';
import { useStyleStore } from './stores/style.store';

const styleStore = useStyleStore();

const theme = computed(() => (styleStore.isDarkTheme ? darkTheme : null));
const themeOverrides = computed(() => (styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides));

const { locale } = useI18n();

syncRef(
  locale,
  useStorage('locale', locale),
);
</script>

<template>
  <div class="app-root" :class="{ 'app-root--dark': styleStore.isDarkTheme }">
    <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
      <NGlobalStyle />
      <NMessageProvider placement="bottom">
        <NNotificationProvider placement="bottom-right">
          <BaseLayout>
            <OfflineRouteUnavailable v-if="offlineRouteFailure" />
            <RouterView v-else v-slot="{ Component, route: renderedRoute }">
              <ToolLayout v-if="renderedRoute.meta.isTool === true" :key="renderedRoute.path">
                <component :is="Component" :key="renderedRoute.path" />
              </ToolLayout>
              <component :is="Component" v-else :key="renderedRoute.path" />
            </RouterView>
          </BaseLayout>
        </NNotificationProvider>
      </NMessageProvider>
    </n-config-provider>
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
