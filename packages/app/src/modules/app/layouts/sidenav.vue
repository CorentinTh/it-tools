<script setup>
import { Button } from '@/src/modules/ui/components/button';
import { useCommandPaletteStore } from '../../command-palette/command-palette.store';
import { DropdownMenu } from '../../ui/components/dropdown-menu';
import DropdownMenuContent from '../../ui/components/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '../../ui/components/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuTrigger from '../../ui/components/dropdown-menu/DropdownMenuTrigger.vue';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/components/sheet';

const { openCommandPalette } = useCommandPaletteStore();
const colorMode = useColorMode();
</script>

<template>
  <div class="w-full min-h-screen text-sm relative font-sans flex flex-row">
    <div class="w-64 border-r bg-white dark:bg-background shrink-0 hidden sm:block">
      <sidenav-menu />
    </div>
    <div class="flex-1 flex flex-col">
      <div class="border-b h-[60px] flex items-center justify-between px-6 bg-white dark:bg-background">
        <div class="flex items-center gap-4">
          <div class="sm:hidden">
            <Sheet>
              <SheetTrigger>
                <Button variant="ghost" size="icon">
                  <Icon name="i-tabler-menu-2" class="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" class="p-0 text-sm">
                <sidenav-menu />
              </SheetContent>
            </Sheet>
          </div>

          <Button variant="outline" class="sm:pr-12 md:pr-24 text-muted-foreground" @click="openCommandPalette">
            <Icon name="i-tabler-search" class="mr-2 size-4" />
            {{ $t('home.search-tools') }}
          </Button>
        </div>

        <div>
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

      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>
