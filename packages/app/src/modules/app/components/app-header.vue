<script setup>
import { Button } from '@/src/modules/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/modules/ui/components/dropdown-menu';

const colorMode = useColorMode();
</script>

<template>
  <div class="w-full border-b bg-card">
    <div class="max-w-screen-xl mx-auto flex items-center justify-between py-2 px-6">
      <NuxtLink variant="link" class="text-xl font-semibold border-b border-transparent hover:no-underline h-auto px-1 rounded-none !transition-border-color-250" :as="Button" :to="localePath('/')" aria-label="Home">
        <span class="font-bold text-foreground">IT</span>
        <span class="text-[80%] font-extrabold border-[2px] leading-none border-current rounded-md px-1 py-0.5 ml-1.5 text-primary">TOOLS</span>
      </NuxtLink>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            <Icon name="i-tabler-moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Icon name="i-tabler-sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span class="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem class="cursor-pointer" :class="{ 'font-bold': colorMode.preference === 'light' }" @click="colorMode.preference = 'light'">
            <Icon name="i-tabler-sun" class="mr-2 size-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer" :class="{ 'font-bold': colorMode.preference === 'dark' }" @click="colorMode.preference = 'dark'">
            <Icon name="i-tabler-moon" class="mr-2 size-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer" :class="{ 'font-bold': colorMode.preference === 'system' }" @click="colorMode.preference = 'system'">
            <Icon name="i-tabler-device-laptop" class="mr-2 size-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
