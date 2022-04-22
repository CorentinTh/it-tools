<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button
        size="large"
        circle
        quaternary
        tag="a"
        href="https://github.com/CorentinTh/it-tools"
        rel="noopener"
        target="_blank"
      >
        <n-icon size="25" :component="BrandGithub" />
      </n-button>
    </template>
    Github repository
  </n-tooltip>

  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button
        size="large"
        circle
        quaternary
        tag="a"
        href="https://twitter.com/cthmsst"
        rel="noopener"
        target="_blank"
      >
        <n-icon size="25" :component="BrandTwitter" />
      </n-button>
    </template>
    Creator twitter
  </n-tooltip>

  <router-link to="/about" #="{ navigate, href }" custom>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button tag="a" :href="href" circle quaternary size="large" aria-label="Home" @click="navigate">
          <n-icon size="25" :component="InfoCircle" />
        </n-button>
      </template>
      About
    </n-tooltip>
  </router-link>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button size="large" circle quaternary @click="isDarkTheme = !isDarkTheme">
        <n-icon v-if="isDarkTheme" size="25" :component="Sun" />
        <n-icon v-else size="25" :component="Moon" />
      </n-button>
    </template>
    <span v-if="isDarkTheme">Light mode</span>
    <span v-else>Dark mode</span>
  </n-tooltip>
</template>

<script setup lang="ts">
import { useStyleStore } from '@/stores/style.store';
import { toRefs } from 'vue';
import { BrandGithub, BrandTwitter, Moon, Sun, InfoCircle } from '@vicons/tabler';

const styleStore = useStyleStore();
const { isDarkTheme } = toRefs(styleStore);
</script>

<style lang="less" scoped>
.n-button {
  &:not(:last-child) {
    margin-right: 5px;
  }
}
</style>
