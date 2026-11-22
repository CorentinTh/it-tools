<script lang="ts" setup>
import { NIcon } from 'naive-ui';

import { RouterLink } from 'vue-router';
import { Home2, Menu2 } from '@vicons/tabler';

import { storeToRefs } from 'pinia';
import MenuLayout from '../components/MenuLayout.vue';
import NavbarButtons from '../components/NavbarButtons.vue';
import { useStyleStore } from '@/stores/style.store';
import type { ToolCategory } from '@/tools/tools.types';
import { useToolStore } from '@/tools/tools.store';
import CollapsibleToolMenu from '@/components/CollapsibleToolMenu.vue';

const styleStore = useStyleStore();

const { t } = useI18n();

const toolStore = useToolStore();
const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);

const tools = computed<ToolCategory[]>(() => [
  ...(favoriteTools.value.length > 0 ? [{ name: t('tools.categories.favorite-tools'), components: favoriteTools.value }] : []),
  ...toolsByCategory.value,
]);
</script>

<template>
  <MenuLayout class="menu-layout" :class="{ isSmallScreen: styleStore.isSmallScreen }">
    <template #sider>
      <RouterLink to="/" class="hero-wrapper">
        <div class="terminal-wordmark">
          WOW/<span class="terminal-cursor" />
        </div>
        <div class="system-status">
          <span class="status-dot" /> systems ready
        </div>
      </RouterLink>

      <div class="sider-content">
        <div v-if="styleStore.isSmallScreen" flex flex-col items-center>
          <locale-selector w="90%" />

          <div flex justify-center>
            <NavbarButtons />
          </div>
        </div>

        <CollapsibleToolMenu :tools-by-category="tools" />
      </div>
    </template>

    <template #content>
      <div class="terminal-topbar">
        <c-button
          circle
          variant="text"
          :aria-label="$t('home.toggleMenu')"
          @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed"
        >
          <NIcon size="25" :component="Menu2" />
        </c-button>

        <c-tooltip :tooltip="$t('home.home')" position="bottom">
          <c-button to="/" circle variant="text" :aria-label="$t('home.home')">
            <NIcon size="25" :component="Home2" />
          </c-button>
        </c-tooltip>

        <div class="command-search">
          <span class="prompt-mark">›</span>
          <command-palette />
        </div>

        <locale-selector v-if="!styleStore.isSmallScreen" />

        <div>
          <NavbarButtons v-if="!styleStore.isSmallScreen" />
        </div>
      </div>
      <slot />
    </template>
  </MenuLayout>
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

.sider-content {
  padding-top: 96px;
  padding-bottom: 20px;
}

.hero-wrapper {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  width: 100%;
  height: 96px;
  z-index: 10;
  padding: 0 22px;
  color: #eafff8;
  background: #0e161b;
  border-bottom: 1px solid #203036;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.terminal-wordmark {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.06em;
}

.terminal-cursor {
  width: 9px;
  height: 20px;
  display: inline-block;
  background: #46f0b4;
  animation: cursor-blink 1.1s steps(1) infinite;
}

.system-status {
  margin-top: 9px;
  color: #6f8b84;
  font-size: 10px;
}

.status-dot {
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 5px;
  background: #46f0b4;
  box-shadow: 0 0 10px #46f0b480;
}

.terminal-topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;

  ::v-deep(.n-button) {
    color: #8ca0a6;

    &:hover {
      color: #46f0b4;
    }
  }

  ::v-deep(.n-base-selection) {
    background: #111c21;
    border-color: #2a3d42;
    color: #9bb0b4;
  }

  ::v-deep(.n-base-selection-label) {
    background: transparent;
  }
}

.command-search {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 650px;
  border: 1px solid #2a3d42;
  border-radius: 8px;
  background: #111c21;
  overflow: hidden;

  .prompt-mark {
    margin-left: 13px;
    color: #46f0b4;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 18px;
  }

  ::v-deep(.n-button) {
    border: 0 !important;
    background: transparent !important;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
}

@keyframes cursor-blink {
  50% { opacity: 0.15; }
}

@media (max-width: 700px) {
  .terminal-topbar { gap: 4px; }
}
</style>
