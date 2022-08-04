<script setup lang="ts">
import { toolsWithCategory } from '@/tools';
import { useHead } from '@vueuse/head';
import ToolCard from '../components/ToolCard.vue';

useHead({ title: 'IT Tools - Handy online tools for developers' });
</script>

<template>
  <div class="home-page">
    <n-grid x-gap="12" y-gap="12" cols="1 400:2 800:3 1200:4 2000:8">
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
