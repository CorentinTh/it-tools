<script lang="ts" setup>
import { NIcon } from 'naive-ui';
import { h, ref, type Component } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { LightModeFilled, DarkModeFilled } from '@vicons/material'
import { toolsByCategory } from '@/tools';
import SearchBar from '../components/SearchBar.vue';
import { useStyleStore } from '@/stores/style.store';

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
        icon: makeIcon(icon)
    }))
}))

</script>

<template>
    <n-layout has-sider>
        <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :collapsed="collapsed"
            show-trigger
            @collapse="collapsed = true"
            @expand="collapsed = false"
        >
            <router-link
                to="/"
                style="text-decoration: none; color: grey; display: block; text-align: center; margin:25px 0; font-size: 25px;"
            >
                <strong>IT-Tools</strong>
            </router-link>

            <n-menu
                :value="route.name"
                class="menu"
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="m"
                v-model:value="activeKey"
            />
        </n-layout-sider>
        <n-layout class="content">
            <div class="bar-wrapper">
                <search-bar />

                <n-button
                    circle
                    quaternary
                    @click="styleStore.isDarkTheme = !styleStore.isDarkTheme"
                >
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
.bar-wrapper {
    display: flex;
    & > *:not(:first-child) {
        margin-left: 15px;
    }
    & > :first-child {
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