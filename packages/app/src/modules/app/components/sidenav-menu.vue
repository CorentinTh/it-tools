<script setup>
import { Button } from '@/src/modules/ui/components/button';
import { useToolsStore } from '../../tools/tools.store';

const toolStore = useToolsStore();
const localePath = useLocalePath();
</script>

<template>
  <div class="border-b h-[60px] flex items-center justify-between px-6">
    <NuxtLink variant="link" class="text-xl font-semibold border-b border-transparent hover:no-underline h-auto px-1 rounded-none !transition-border-color-250" :as="Button" :to="localePath('/')" aria-label="Home">
      <span class="font-bold text-foreground">IT</span>
      <span class="text-[80%] font-extrabold border-[2px] leading-none border-current rounded-md px-1 py-0.5 ml-1.5 text-primary">TOOLS</span>
    </NuxtLink>
  </div>

  <div class="pt-4 px-3 flex flex-col gap-0.5">
    <NuxtLink to="/" class="py-1.5 px-3 flex items-center text-muted-foreground hover:text-foreground transition hover:bg-muted rounded-lg">
      <Icon name="i-tabler-home" class="mr-2 size-4" />
      Home
    </NuxtLink>

    <NuxtLink v-for="tool in toolStore.tools" :key="tool.key" class="py-1.5 px-3 flex items-center text-muted-foreground hover:text-foreground transition hover:bg-muted rounded-lg" :to="tool.path" exact-active-class="bg-secondary !text-foreground">
      <Icon :name="tool.icon" class="mr-2 size-4" />
      {{ tool.title }}
    </NuxtLink>
  </div>
</template>
