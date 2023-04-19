<script lang="ts" setup>
import { NIcon, useThemeVars } from 'naive-ui';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Heart, Menu2, Home2 } from '@vicons/tabler';
import { toolsByCategory } from '@/tools';
import { useStyleStore } from '@/stores/style.store';
import { config } from '@/config';
import type { ToolCategory } from '@/tools/tools.types';
import { useToolStore } from '@/tools/tools.store';
import { useTracker } from '@/modules/tracker/tracker.services';
import CollapsibleToolMenu from '@/components/CollapsibleToolMenu.vue';
import SearchBar from '../components/SearchBar.vue';
import HeroGradient from '../assets/hero-gradient.svg?component';
import MenuLayout from '../components/MenuLayout.vue';
import NavbarButtons from '../components/NavbarButtons.vue';

const themeVars = useThemeVars();
const styleStore = useStyleStore();
const version = config.app.version;
const commitSha = config.app.lastCommitSha.slice(0, 7);

const { tracker } = useTracker();

const toolStore = useToolStore();

const tools = computed<ToolCategory[]>(() => [
  ...(toolStore.favoriteTools.length > 0 ? [{ name: 'Your favorite tools', components: toolStore.favoriteTools }] : []),
  ...toolsByCategory,
]);
</script>

<template>
  <menu-layout class="menu-layout" :class="{ isSmallScreen: styleStore.isSmallScreen }">
    <template #sider>
      <router-link to="/" class="hero-wrapper">
        <hero-gradient class="gradient" />
        <div class="text-wrapper">
          <div class="title">IT - TOOLS</div>
          <div class="divider" />
          <div class="subtitle">Handy tools for developers</div>
        </div>
      </router-link>

      <div class="sider-content">
        <n-space v-if="styleStore.isSmallScreen" justify="center">
          <navbar-buttons />
        </n-space>

        <collapsible-tool-menu :tools-by-category="tools" />

        <div class="footer">
          <div>
            IT-Tools

            <c-link target="_blank" rel="noopener" :href="`https://github.com/CorentinTh/it-tools/tree/v${version}`">
              v{{ version }}
            </c-link>

            <template v-if="commitSha && commitSha.length > 0">
              -
              <c-link
                target="_blank"
                rel="noopener"
                type="primary"
                :href="`https://github.com/CorentinTh/it-tools/tree/${commitSha}`"
              >
                {{ commitSha }}
              </c-link>
            </template>
          </div>
          <div>
            © {{ new Date().getFullYear() }}
            <c-link target="_blank" rel="noopener" href="https://github.com/CorentinTh"> Corentin Thomasset </c-link>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div class="navigation">
        <c-button
          :size="styleStore.isSmallScreen ? 'medium' : 'large'"
          circle
          variant="text"
          aria-label="Toggle menu"
          @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed"
        >
          <n-icon size="25" :component="Menu2" />
        </c-button>

        <n-tooltip trigger="hover">
          <template #trigger>
            <c-button to="/" circle variant="text" aria-label="Home">
              <n-icon size="25" :component="Home2" />
            </c-button>
          </template>
          Home
        </n-tooltip>

        <search-bar />

        <navbar-buttons v-if="!styleStore.isSmallScreen" />

        <n-tooltip trigger="hover">
          <template #trigger>
            <c-button
              round
              href="https://www.buymeacoffee.com/cthmsst"
              rel="noopener"
              target="_blank"
              class="support-button"
              :bordered="false"
              @click="() => tracker.trackEvent({ eventName: 'Support button clicked' })"
            >
              Buy me a coffee
              <n-icon v-if="!styleStore.isSmallScreen" :component="Heart" ml-2 />
            </c-button>
          </template>
          ❤ Support IT Tools development !
        </n-tooltip>
      </div>
      <slot />
    </template>
  </menu-layout>
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

.support-button {
  background: rgb(37, 99, 108);
  background: linear-gradient(48deg, rgba(37, 99, 108, 1) 0%, rgba(59, 149, 111, 1) 60%, rgba(20, 160, 88, 1) 100%);
  color: #fff !important;
  transition: padding ease 0.2s !important;

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
