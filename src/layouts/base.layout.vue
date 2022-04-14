<script lang="ts" setup>
import { NIcon } from 'naive-ui';
import { h, ref, type Component } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { LightModeFilled, DarkModeFilled } from '@vicons/material'
import { Heart } from '@vicons/tabler'
import { toolsByCategory } from '@/tools';
import SearchBar from '../components/SearchBar.vue';
import { useStyleStore } from '@/stores/style.store';
import HeroGradient from '../assets/hero-gradient.svg?component'
import { useThemeVars } from 'naive-ui'

const themeVars = useThemeVars()
const collapsed = ref(false)
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
    <n-layout has-sider>
        <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="260" :collapsed="collapsed"
            @collapse="collapsed = true" @expand="collapsed = false" :show-trigger="false">
            <n-scrollbar>

                <router-link to="/" class="hero-wrapper">
                    <hero-gradient class="gradient" />
                    <div class="text-wrapper">
                        <div class="title">IT - TOOLS</div>
                        <div class="divider" />
                        <div class="subtitle">Handy tools for developers</div>
                    </div>
                </router-link>

                <n-menu :value="route.name" class="menu" :collapsed="collapsed" :collapsed-width="64"
                    :collapsed-icon-size="22" :options="m" v-model:value="activeKey" />


            </n-scrollbar>
        </n-layout-sider>
        <n-layout class="content">
            <div class="bar-wrapper">
                <search-bar />
                <n-button type="primary" tag="a" href="https://github.com/sponsors/CorentinTh" rel="noopener"
                    target="_blank">
                    <n-icon :component="Heart" />&nbsp;
                    Sponsor
                </n-button>
                <n-button circle quaternary @click="styleStore.isDarkTheme = !styleStore.isDarkTheme">
                    <n-icon size="large" v-if="styleStore.isDarkTheme">
                        <LightModeFilled />
                    </n-icon>
                    <n-icon size="large" v-else>
                        <DarkModeFilled />
                    </n-icon>
                </n-button>
            </div>
            <slot />
        </n-layout>
    </n-layout>
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

.n-menu {
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

    .gradient {
        margin-top: -80px;
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

.bar-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    &>*:not(:first-child) {
        margin-left: 15px;
    }

    .search-bar {
        flex-grow: 1;
    }
}

.content {

    // background-color: #f1f5f9;
    ::v-deep(.n-layout-scroll-container) {
        padding: 26px;
    }
}

.n-layout {
    height: 100vh;
}
</style>