<script setup>
import { Button } from '../../ui/components/button';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/components/sheet';
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
        </div>

        <app-header />
      </div>

      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>
