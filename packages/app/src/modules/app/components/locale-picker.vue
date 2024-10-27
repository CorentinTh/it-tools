<script setup lang="ts">
import { Button } from '../../ui/components/button';
import { DropdownMenu } from '../../ui/components/dropdown-menu';
import DropdownMenuContent from '../../ui/components/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '../../ui/components/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuTrigger from '../../ui/components/dropdown-menu/DropdownMenuTrigger.vue';

const { locale, locales, setLocale } = useI18n();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <slot>
        <Button variant="ghost" aria-label="Change language">
          <Icon name="i-tabler-language" class="size-5 mr-1" />
          <Icon name="i-tabler-chevron-down" class="text-muted-foreground" />
        </Button>
      </slot>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="({ name, code }) in locales"
        :key="code"
        class="cursor-pointer"
        :class="{ 'font-bold': locale === code }"
        @click="setLocale(code)"
      >
        {{ name }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
