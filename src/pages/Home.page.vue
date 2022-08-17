<script setup lang="ts">
import { toolsWithCategory } from '@/tools';
import { Heart } from '@vicons/tabler';
import { useHead } from '@vueuse/head';
import ColoredCard from '../components/ColoredCard.vue';
import ToolCard from '../components/ToolCard.vue';

useHead({ title: 'IT Tools - Handy online tools for developers' });
</script>

<template>
  <div class="home-page">
    <n-grid x-gap="12" y-gap="12" cols="1 400:2 800:3 1200:4 2000:8">
      <n-gi>
        <colored-card title="You like it-tools?" :icon="Heart">
          Give us a star on
          <a
            href="https://github.com/CorentinTh/it-tools"
            rel="noopener"
            target="_blank"
            aria-label="IT-Tools' github repository"
            >github</a
          >
          or follow us on
          <a
            href="https://twitter.com/ittoolsdottech"
            rel="noopener"
            target="_blank"
            aria-label="IT-Tools' twitter account"
            >twitter</a
          >! Thank you
          <n-icon :component="Heart" />
        </colored-card>
      </n-gi>
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
