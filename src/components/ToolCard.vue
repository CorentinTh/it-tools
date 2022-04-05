<template>
    <router-link :to="tool.path">
        <n-card class="tool-card">
            <n-icon class="icon" size="35">
                <component :is="tool.icon" />
            </n-icon>
            <n-h3 class="title">{{ tool.name }}</n-h3>
            <div class="description">
                <n-ellipsis :line-clamp="2" :tooltip="false">{{ tool.description }}</n-ellipsis>
            </div>
        </n-card>
    </router-link>
</template>

<script setup lang="ts">
import type { ITool } from '@/tools/Tool';
import { toRefs, defineProps } from 'vue';

const props = defineProps<{ tool: ITool & { category: string } }>()
const { tool } = toRefs(props)

</script>

<style lang="less" scoped>
a {
    text-decoration: none;
}

.tool-card {
    &:hover {
        border-color: var(--n-color-target);
    }
    .icon {
        opacity: 0.7;
    }
    .title {
        margin: 5px 0;
    }
    .description {
        opacity: 0.7;
        margin: 5px 0;
    }
}
</style>