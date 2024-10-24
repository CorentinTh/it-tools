<script setup>
import { Badge } from '@/src/modules/ui/components/badge';
import { Button } from '@/src/modules/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/modules/ui/components/dropdown-menu';
</script>

<template>
  <grid-background>
    <div class="flex gap-24 mx-auto justify-center pb-8 mt-8 items-center px-6">
      <div class="max-w-xl">
        <div class="flex gap-2">
          <Badge class="text-primary bg-primary/10 hover:bg-primary/10">
            <!-- {{ $t('landing.hero.badges.open-source') }} -->
            Open Source
          </Badge>
          <Badge class="text-primary bg-primary/10 hover:bg-primary/10">
            <!-- {{ $t('landing.hero.badges.free') }} -->
            Free
          </Badge>
          <Badge class="text-primary bg-primary/10 hover:bg-primary/10">
            <!-- {{ $t('landing.hero.badges.self-hostable') }} -->
            Self-hostable
          </Badge>
        </div>

        <h1 class="text-5xl font-semibold border-b border-transparent hover:no-underline h-auto py-0 px-1 ml--1 rounded-none !transition-border-color-250 my-6">
          <span class="font-bold ">IT</span>
          <span class="text-[90%] text-primary font-extrabold border-[5px] leading-none border-current rounded-xl px-2 py-0.5 ml-3">TOOLS</span>
        </h1>

        <p class="text-xl text-gray-400 mb-4">
          <!-- {{ $t('app.description') }} -->
          The open-source collection of handy online tools to help developers in their daily life.
        </p>

        <div class="flex gap-4">
          <Button>
            <!-- {{ $t('landing.hero.all-the-tools') }} -->
            All the tools
            <Icon name="i-tabler-arrow-right" class="ml-2 size-4" />
          </Button>

          <Button variant="outline">
            <!-- {{ $t('landing.hero.search-tools') }} -->
            <Icon name="i-tabler-search" class="mr-2 size-4" />
            Search tools
          </Button>
        </div>
      </div>

      <div class="relative hidden sm:block">
        <div class="absolute top-4 left-0 w-full h-full flex items-center justify-center blur-2xl rounded-full opacity-20 bg-gradient-to-br from-primary to-transparent" />
        <Icon name="i-tabler-terminal" class="text-9xl text-primary m-8" />
      </div>
    </div>
  </grid-background>
</template>
