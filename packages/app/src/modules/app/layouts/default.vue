<script setup>
import { Button } from '@/src/modules/ui/components/button';
import { useToolsStore } from '../../tools/tools.store';

const localePath = useLocalePath();
</script>

<template>
  <div class="w-full min-h-screen text-sm relative font-sans flex flex-col">
    <div class="h-[60px] border-b">
      <div class="max-w-screen-xl mx-auto py-2 px-6 w-full flex items-center gap-4 h-full">
        <NuxtLink variant="link" class="text-xl font-semibold border-b border-transparent hover:no-underline h-auto px-1 rounded-none !transition-border-color-250" :as="Button" :to="localePath('/')" aria-label="Home">
          <span class="font-bold text-foreground">IT</span>
          <span class="text-[80%] font-extrabold border-[2px] leading-none border-current rounded-md px-1 py-0.5 ml-1.5 text-primary">TOOLS</span>
        </NuxtLink>

        <app-header />
      </div>
    </div>

    <div class="flex-1 pb-6">
      <slot />
    </div>

    <app-footer />
  </div>
</template>
