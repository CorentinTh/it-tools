<script setup>
import { Button } from '@/src/modules/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/modules/ui/components/dropdown-menu';
import { useCommandPaletteStore } from '../../command-palette/command-palette.store';

const { openCommandPalette } = useCommandPaletteStore();

const colorMode = useColorMode();
</script>

<template>
  <div class="w-full flex items-center justify-between">
    <div>
      <Button variant="outline" class="sm:pr-12 md:pr-24 text-muted-foreground hidden sm:flex" @click="openCommandPalette">
        <Icon name="i-tabler-search" class="mr-2 size-4" />
        {{ $t('home.search-tools') }}
      </Button>
    </div>

    <div class="flex items-center gap-1">
      <Button variant="ghost" size="icon" class="sm:hidden" @click="openCommandPalette">
        <Icon name="i-tabler-search" class="size-5" />
      </Button>

      <LocalePicker />

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            <Icon name="i-tabler-moon" class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Icon name="i-tabler-sun" class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
