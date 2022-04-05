<script setup lang="ts">
import { toolsWithCategory } from '@/tools';
import ToolCard from '../components/ToolCard.vue';
</script>

<template>
    <div class="home-page">
        <n-grid x-gap="12" y-gap="12" :cols="3">
            <n-gi v-for="tool in toolsWithCategory" :key="tool.name">
                <tool-card :tool="tool" />
            </n-gi>
        </n-grid>
    </div>
</template>


<style scoped lang="less">
.home-page {
    padding-top: 50px;
}
</style>