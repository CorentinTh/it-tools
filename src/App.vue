<script setup lang="ts">
import { RouterView } from 'vue-router'
import { layouts } from './layouts';
import { computed } from 'vue';
import { useRoute } from 'vue-router'

import {
  NConfigProvider,
  NGlobalStyle,
} from 'naive-ui'

const route = useRoute();
const layout = computed(() => route?.meta?.layout ?? layouts.base)
</script>

<template>
  <n-config-provider>
    <n-global-style />
    <component :is="layout">
      <router-view />
    </component>
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