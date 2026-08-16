<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import AppProviders from './components/AppProviders.vue';
import { offlineRouteFailure } from './modules/pwa/offline-route-recovery';

const BaseLayout = defineAsyncComponent(() => import('./layouts/base.layout.vue'));
const ToolLayout = defineAsyncComponent(() => import('./layouts/tool.layout.vue'));
const OfflineRouteUnavailable = defineAsyncComponent(() => import('./modules/pwa/OfflineRouteUnavailable.vue'));
</script>

<template>
  <AppProviders>
    <BaseLayout>
      <OfflineRouteUnavailable v-if="offlineRouteFailure" />
      <router-view v-else v-slot="{ Component, route: renderedRoute }">
        <ToolLayout v-if="renderedRoute.meta.isTool === true" :key="renderedRoute.path">
          <component :is="Component" :key="renderedRoute.path" />
        </ToolLayout>
        <component :is="Component" v-else :key="renderedRoute.path" />
      </router-view>
    </BaseLayout>
  </AppProviders>
</template>
