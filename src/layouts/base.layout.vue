<script lang="ts" setup>
import { NIcon } from 'naive-ui';
import { h, ref, type Component } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { User } from '@vicons/tabler'
import { tools } from '@/tools';
import SearchBar from '../components/SearchBar.vue';

const collapsed = ref(false)
const activeKey = ref(null)
const route = useRoute()

const makeLabel = (text: string, to: string) => () => h(RouterLink, { to }, { default: () => text })
const makeIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) })

const menuOptions = tools.map(({ name, path, icon }) => ({
    label: makeLabel(name, path),
    key: name,
    icon: makeIcon(icon)
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
                :options="menuOptions"
                v-model:value="activeKey"
            />
        </n-layout-sider>
        <n-layout class="content">
            <div class="bar-wrapper">
                <search-bar />

                <n-button secondary circle>
                    <n-icon size="large">
                        <user />
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
    background-color: #f1f5f9;
    ::v-deep(.n-layout-scroll-container) {
        padding: 26px;
    }
}
.n-layout {
    height: 100vh;
}
</style>