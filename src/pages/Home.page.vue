<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useToolStore } from '@/tools/tools.store';

const toolStore = useToolStore();

useHead({ title: 'IT Tools - Handy online tools for developers' });
</script>

<template>
  <div class="home-page" m-auto mt-50px max-w-1800px>
    <div my-8 />

    <div v-if="toolStore.favoriteTools.length > 0">
      <div mb-2 mt-6 text-lg font-semibold>
        {{ $t('home.categories.yourFavoriteTools') }}
      </div>
      <div grid-cols="1 sm:2 md:2 lg:3 xl:4" grid gap-12px>
        <tool-card v-for="tool in toolStore.favoriteTools" :key="tool.name" :tool="tool" />
      </div>
    </div>

    <div v-if="toolStore.newTools.length > 0">
      <div mb-2 mt-6 text-lg font-semibold>
        {{ $t('home.categories.newestTools') }}
      </div>
      <div grid-cols="1 sm:2 md:2 lg:3 xl:4" grid gap-12px>
        <tool-card v-for="tool in toolStore.newTools" :key="tool.name" :tool="tool" />
      </div>
    </div>

    <div mb-2 mt-6 text-lg font-semibold>
      {{ $t('home.categories.allTheTools') }}
    </div>
    <div grid-cols="1 sm:2 md:2 lg:3 xl:4" grid gap-12px>
      <tool-card v-for="tool in toolStore.tools" :key="tool.name" :tool="tool" />
    </div>
  </div>
</template>
