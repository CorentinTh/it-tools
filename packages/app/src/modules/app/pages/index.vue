<script setup>
import { Badge } from '@/src/modules/ui/components/badge';
import { Button } from '@/src/modules/ui/components/button';
import { useCommandPaletteStore } from '../../command-palette/command-palette.store';
import { useToolsStore } from '../../tools/tools.store';
import Card from '../../ui/components/card/Card.vue';

const { tools } = useToolsStore();
const { openCommandPalette } = useCommandPaletteStore();
</script>

<template>
  <grid-background>
    <div class="flex gap-24 mx-auto justify-center pb-8 mt-8 items-center px-6">
      <div class="max-w-xl">
        <div class="flex gap-2">
          <Badge class="text-primary bg-primary/10 hover:bg-primary/10 shadow-none">
            {{ $t('home.open-source') }}
          </Badge>
          <Badge class="text-primary bg-primary/10 hover:bg-primary/10 shadow-none">
            {{ $t('home.free') }}
          </Badge>
          <Badge class="text-primary bg-primary/10 hover:bg-primary/10 shadow-none">
            {{ $t('home.self-hostable') }}
          </Badge>
        </div>

        <h1 class="text-5xl font-semibold border-b border-transparent hover:no-underline h-auto py-0 px-1 ml--1 rounded-none !transition-border-color-250 my-6">
          <span class="font-bold ">IT</span>
          <span class="text-[90%] text-primary font-extrabold border-[5px] leading-none border-current rounded-xl px-2 py-0.5 ml-3">TOOLS</span>
        </h1>

        <p class="text-xl text-gray-400 mb-4">
          {{ $t('app.description') }}
        </p>

        <div class="flex gap-4">
          <Button>
            {{ $t('home.all-the-tools') }}
            <Icon name="i-tabler-arrow-right" class="ml-2 size-4" />
          </Button>

          <Button variant="outline" @click="openCommandPalette">
            <Icon name="i-tabler-search" class="mr-2 size-4" />
            {{ $t('home.search-tools') }}
          </Button>
        </div>
      </div>

      <div class="relative hidden sm:block">
        <div class="absolute top-4 left-0 w-full h-full flex items-center justify-center blur-2xl rounded-full opacity-20 bg-gradient-to-br from-primary to-transparent" />
        <Icon name="i-tabler-terminal" class="text-9xl text-primary m-8" />
      </div>
    </div>
  </grid-background>

  <div class="max-w-screen-xl mx-auto px-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      <NuxtLink v-for="tool in tools" :key="tool.key" :to="tool.path">
        <Card class="p-6 h-full cursor-pointer hover:shadow-lg transition hover:translate-y-[-2px]">
          <Icon :name="tool.icon" class="size-12 text-muted-foreground/60" />

          <div class="font-semibold text-base">
            {{ tool.title }}
          </div>

          <p class="text-muted-foreground mt-2">
            {{ tool.description }}
          </p>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>
