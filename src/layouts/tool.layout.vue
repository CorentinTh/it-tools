<script lang="ts" setup>
import { useRoute } from 'vue-router';
import BaseLayout from './base.layout.vue';
import { useHead } from '@vueuse/head'
import type { HeadObject } from '@vueuse/head'
import { reactive } from 'vue';

const route = useRoute()

const head = reactive<HeadObject>({
    title: `${route.meta.name} - IT Tools`,
    meta: [
        {
            name: 'description',
            content: route.meta.description
        },
        {
            name: 'keywords',
            content: route.meta.keywords
        }
    ]
})
useHead(head)
</script>

<template>
    <base-layout>
        <div class="tool-layout">
            <div class="tool-header">
                <n-h1>{{ route.meta.name }}</n-h1>
                <div class="separator" />
                <div class="description">{{ route.meta.description }}</div>
            </div>

            <slot />
        </div>
    </base-layout>
</template>

<style lang="less" scoped>
.tool-layout {
    max-width: 700px;
    margin: 0 auto;
    box-sizing: border-box;

    .tool-header {
        padding: 40px 0;

        .n-h1 {
            opacity: 0.9;
            font-size: 40px;
            font-weight: 400;
            margin: 0;
            line-height: 1;
        }

        .separator {
            width: 200px;
            height: 2px;
            background: rgb(161, 161, 161);

            margin: 10px 0;
        }

        .description {
            margin: 0;

            opacity: 0.7;
        }
    }
}
</style>