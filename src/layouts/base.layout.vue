<script lang="ts" setup>
import { NIcon } from 'naive-ui';
import { h, ref, type Component } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { Heart, BrandGithub, BrandTwitter, Moon, Sun, Menu2, Home2, InfoCircle } from '@vicons/tabler'
import { toolsByCategory } from '@/tools';
import SearchBar from '../components/SearchBar.vue';
import { useStyleStore } from '@/stores/style.store';
import HeroGradient from '../assets/hero-gradient.svg?component'
import { useThemeVars } from 'naive-ui'
import MenuLayout from '../components/MenuLayout.vue'

const themeVars = useThemeVars()
const activeKey = ref(null)
const route = useRoute()
const styleStore = useStyleStore()

const makeLabel = (text: string, to: string) => () => h(RouterLink, { to }, { default: () => text })
const makeIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) })

const m = toolsByCategory.map(category => ({
    label: category.name,
    key: category.name,
    type: 'group',
    children: category.components.map(({ name, path, icon }) => ({
        label: makeLabel(name, path),
        icon: makeIcon(icon),
        key: name
    }))
}))

</script>

<template>
  <menu-layout
    class="menu-layout"
    :class="{ isSmallScreen: styleStore.isSmallScreen }"
  >
    <template #sider>
      <router-link
        to="/"
        class="hero-wrapper"
      >
        <hero-gradient class="gradient" />
        <div class="text-wrapper">
          <div class="title">
            IT - TOOLS
          </div>
          <div class="divider" />
          <div class="subtitle">
            Handy tools for developers
          </div>
        </div>
      </router-link>

      <div class="sider-content">
        <n-space
          v-if="styleStore.isSmallScreen"
          justify="center"
        >
          <n-button
            size="large"
            circle
            quaternary
            tag="a"
            href="https://github.com/CorentinTh/it-tools"
            rel="noopener"
            target="_blank"
          >
            <n-icon
              size="25"
              :component="BrandGithub"
            />
          </n-button>
          <n-button
            size="large"
            circle
            quaternary
            tag="a"
            href="https://twitter.com/cthmsst"
            rel="noopener"
            target="_blank"
          >
            <n-icon
              size="25"
              :component="BrandTwitter"
            />
          </n-button>
          <router-link
            to="/about"
            #="{ navigate, href }"
            custom
          >
            <n-button
              tag="a"
              :href="href"
              circle
              quaternary
              size="large"
              aria-label="Home"
              @click="navigate"
            >
              <n-icon
                size="25"
                :component="InfoCircle"
              />
            </n-button>
          </router-link>
          <n-button
            size="large"
            circle
            quaternary
            @click="styleStore.isDarkTheme = !styleStore.isDarkTheme"
          >
            <n-icon
              v-if="styleStore.isDarkTheme"
              size="25"
              :component="Sun"
            />
            <n-icon
              v-else
              size="25"
              :component="Moon"
            />
          </n-button>
        </n-space>

        <n-menu
          v-model:value="activeKey"
          :value="route.name"
          class="menu"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="m"
          :indent="20"
        />
      </div>
    </template>

    <template #content>
      <div class="navigation">
        <n-button
          :size="styleStore.isSmallScreen ? 'medium' : 'large'"
          circle
          quaternary
          aria-label="Toogle menu"
          @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed"
        >
          <n-icon
            size="25"
            :component="Menu2"
          />
        </n-button>

        <router-link
          to="/"
          #="{ navigate, href }"
          custom
        >
          <n-button
            tag="a"
            :href="href"
            :size="styleStore.isSmallScreen ? 'medium' : 'large'"
            circle
            quaternary
            aria-label="Home"
            @click="navigate"
          >
            <n-icon
              size="25"
              :component="Home2"
            />
          </n-button>
        </router-link>

        <search-bar />


        <n-button
          type="primary"
          tag="a"
          href="https://github.com/sponsors/CorentinTh"
          rel="noopener"
          target="_blank"
        >
          <n-icon
            v-if="!styleStore.isSmallScreen"
            :component="Heart"
            style="margin-right: 5px;"
          />
          Sponsor
        </n-button>
        <n-button
          v-if="!styleStore.isSmallScreen"
          size="large"
          circle
          quaternary
          tag="a"
          href="https://github.com/CorentinTh/it-tools"
          rel="noopener"
          target="_blank"
          aria-label="Github repository"
        >
          <n-icon
            size="25"
            :component="BrandGithub"
          />
        </n-button>
        <n-button
          v-if="!styleStore.isSmallScreen"
          size="large"
          circle
          quaternary
          tag="a"
          href="https://twitter.com/cthmsst"
          rel="noopener"
          target="_blank"
          aria-label="Twitter account"
        >
          <n-icon
            size="25"
            :component="BrandTwitter"
          />
        </n-button>

        <router-link
          v-if="!styleStore.isSmallScreen"
          to="/about"
          #="{ navigate, href }"
          custom
        >
          <n-button
            tag="a"
            :href="href"
            circle
            quaternary
            size="large"
            aria-label="Home"
            @click="navigate"
          >
            <n-icon
              size="25"
              :component="InfoCircle"
            />
          </n-button>
        </router-link>

        <n-button
          v-if="!styleStore.isSmallScreen"
          size="large"
          circle
          quaternary
          aria-label="Toogle theme"
          @click="styleStore.isDarkTheme = !styleStore.isDarkTheme"
        >
          <n-icon
            v-if="styleStore.isDarkTheme"
            size="25"
            :component="Sun"
          />
          <n-icon
            v-else
            size="25"
            :component="Moon"
          />
        </n-button>
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

.sider-content {
    padding-top: 160px;
    padding-bottom: 200px;
}

.hero-wrapper {
    position: absolute;
    display: block;
    position: absolute;
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

.navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;

    &>*:not(:first-child) {
        margin-left: 10px;

        .isSmallScreen & {
            margin-left: 5px;
        }
    }


    .search-bar {
        // width: 100%;
        flex-grow: 1;
    }
}
</style>