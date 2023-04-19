<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <c-button
        circle
        variant="text"
        href="https://github.com/CorentinTh/it-tools"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="IT-Tools' GitHub repository"
      >
        <n-icon size="25" :component="BrandGithub" />
      </c-button>
    </template>
    Github repository
  </n-tooltip>

  <n-tooltip trigger="hover">
    <template #trigger>
      <c-button
        circle
        variant="text"
        href="https://twitter.com/ittoolsdottech"
        rel="noopener"
        target="_blank"
        aria-label="IT Tools' Twitter account"
      >
        <n-icon size="25" :component="BrandTwitter" />
      </c-button>
    </template>
    IT Tools' Twitter account
  </n-tooltip>

  <n-tooltip trigger="hover">
    <template #trigger>
      <c-button circle variant="text" to="/about" aria-label="About">
        <n-icon size="25" :component="InfoCircle" />
      </c-button>
    </template>
    About
  </n-tooltip>
  <n-tooltip trigger="hover">
    <template #trigger>
      <c-button circle variant="text" aria-label="Toggle dark/light mode" @click="toggleDarkTheme">
        <n-icon v-if="isDarkTheme" size="25" :component="Sun" />
        <n-icon v-else size="25" :component="Moon" />
      </c-button>
    </template>
    <span v-if="isDarkTheme">Light mode</span>
    <span v-else>Dark mode</span>
  </n-tooltip>
</template>

<script setup lang="ts">
import { useStyleStore } from '@/stores/style.store';
import { useThemeStore } from '@/ui/theme/theme.store';
import { BrandGithub, BrandTwitter, InfoCircle, Moon, Sun } from '@vicons/tabler';
import { toRefs } from 'vue';

const styleStore = useStyleStore();
const { isDarkTheme } = toRefs(styleStore);

const themeStore = useThemeStore();

function toggleDarkTheme() {
  isDarkTheme.value = !isDarkTheme.value;

  themeStore.toggleTheme();
}
</script>

<style lang="less" scoped>
.n-button {
  &:not(:last-child) {
    margin-right: 5px;
  }
}
</style>
