<script lang="ts" setup>
import { NIcon, useThemeVars } from 'naive-ui';
import { RouterLink } from 'vue-router';
import { Heart, Menu2, Home2 } from '@vicons/tabler';
import { useStyleStore } from '@/stores/style.store';
import SearchBar from '../components/SearchBar.vue';
import BaseLayout from './base.layout.vue';
import NavbarButtons from '../components/NavbarButtons.vue';

const themeVars = useThemeVars();
const styleStore = useStyleStore();
</script>

<template>
  <base-layout class="base-layout">
    <div class="navigation">
      <n-button
        :size="styleStore.isSmallScreen ? 'medium' : 'large'"
        circle
        quaternary
        aria-label="Toggle menu"
        @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed"
      >
        <n-icon size="25" :component="Menu2" />
      </n-button>

      <router-link to="/" #="{ navigate, href }" custom>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              tag="a"
              :href="href"
              :size="styleStore.isSmallScreen ? 'medium' : 'large'"
              circle
              quaternary
              aria-label="Home"
              @click="navigate"
            >
              <n-icon size="25" :component="Home2" />
            </n-button>
          </template>
          Home
        </n-tooltip>
      </router-link>

      <search-bar />

      <navbar-buttons v-if="!styleStore.isSmallScreen" />

      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button
            round
            type="primary"
            tag="a"
            href="https://github.com/sponsors/CorentinTh"
            rel="noopener"
            target="_blank"
            class="support-button"
            :bordered="false"
          >
            Buy me a coffee

            <n-icon v-if="!styleStore.isSmallScreen" :component="Heart" style="margin-left: 8px" size="20px" />
          </n-button>
        </template>
        ❤ Support IT Tools development !
      </n-tooltip>
    </div>
    <slot />
  </base-layout>
</template>

<style lang="less" scoped>
// ::v-deep(.n-layout-scroll-container) {
//     @percent: 4%;
//     @position: 25px;
//     @size: 50px;
//     @color: #eeeeee25;
//     background-image: radial-gradient(@color @percent, transparent @percent),
//         radial-gradient(@color @percent, transparent @percent);
//     background-position: 0 0, @position @position;
//     background-size: @size @size;
// }

::v-deep(.content .n-layout-scroll-container) {
  padding: 26px;
}

.support-button {
  background: rgb(37, 99, 108);
  background: linear-gradient(48deg, rgba(37, 99, 108, 1) 0%, rgba(59, 149, 111, 1) 60%, rgba(20, 160, 88, 1) 100%);
  color: #fff;
  transition: all ease 0.2s;

  &:hover {
    color: #fff;
    padding-left: 30px;
    padding-right: 30px;
  }
}

.footer {
  text-align: center;
  color: #838587;
  margin-top: 20px;
  padding: 20px 0;
}

.sider-content {
  padding-top: 160px;
  padding-bottom: 200px;
}

.hero-wrapper {
  position: absolute;
  display: block;
  left: 0;
  width: 100%;
  z-index: 10;
  overflow: hidden;

  .gradient {
    margin-top: -65px;
  }

  .text-wrapper {
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
    top: 16px;
    color: #fff;

    .title {
      font-size: 25px;
      font-weight: 600;
    }

    .divider {
      width: 50px;
      height: 2px;
      border-radius: 4px;
      background-color: v-bind('themeVars.primaryColor');
      margin: 0 auto 5px;
    }

    .subtitle {
      font-size: 16px;
    }
  }
}

// ::v-deep(.n-menu-item-content-header) {
//   overflow: visible !important;
//   // overflow-x: hidden !important;
// }

.navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  & > *:not(:last-child) {
    margin-right: 5px;
  }

  .search-bar {
    // width: 100%;
    flex-grow: 1;
  }
}
</style>
