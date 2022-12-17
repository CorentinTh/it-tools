<template>
  <div class="hero">
    <!-- <img :src="HeroGradientUrl" alt="Hero background image" class="hero-background" /> -->
    <div class="background-wrapper" :style="{ backgroundImage: `url(${HeroGradientUrl})` }">
      <div class="navigation">
        <n-button
          :size="styleStore.isSmallScreen ? 'medium' : 'large'"
          circle
          quaternary
          aria-label="Toggle menu"
          color="#fff"
          @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed"
        >
          <n-icon size="25" :component="Menu2" />
        </n-button>

        <div class="spacer"></div>

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
              ghost
              color="#fff"
            >
              Buy me a coffee

              <n-icon v-if="!styleStore.isSmallScreen" :component="Heart" style="margin-left: 8px" size="20px" />
            </n-button>
          </template>
          ❤ Support IT Tools development !
        </n-tooltip>
      </div>

      <n-space justify="center" class="content" vertical>
        <n-h1> Hello, world! </n-h1>
        <div class="subtitle">
          Welcome to IT-Tools! The collection of handy online tool for devs. Find everything you need to work in IT!
        </div>
        <search-bar />
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeroGradientUrl from '@/assets/hero-gradient.svg?url';
import NavbarButtons from '@/components/NavbarButtons.vue';
import SearchBar from '@/components/SearchBar.vue';
import { useStyleStore } from '@/stores/style.store';
import { Heart, Menu2 } from '@vicons/tabler';

const styleStore = useStyleStore();
</script>

<style scoped lang="less">
.hero {
  position: relative;
  color: #fff !important;

  .n-h1 {
    margin-bottom: 0;
    line-height: 1;
    color: #fff !important;
  }

  .subtitle {
    opacity: 0.8;
    margin-bottom: 20px;
  }

  .background-wrapper {
    //   background: rgb(37, 99, 108);
    //   background: linear-gradient(48deg, rgba(37, 99, 108, 1) 0%, rgba(59, 149, 111, 1) 60%, rgba(20, 160, 88, 1) 100%);

    background-size: 100% 150%;
    background-position: bottom;
  }

  .content {
    padding: 50px 0 300px;
    max-width: 900px;
    margin: 0 auto;
  }

  .navigation {
    padding: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;

    & > *:not(:last-child) {
      margin-right: 5px;
    }

    .spacer {
      // width: 100%;
      flex-grow: 1;
    }
  }
}
</style>
