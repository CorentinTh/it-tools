<script setup lang="ts">
import { useToolsStore } from '../../tools/tools.store';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../ui/components/command';
import { useCommandPaletteStore } from '../command-palette.store';

const commandPaletteStore = useCommandPaletteStore();
const { tools } = useToolsStore();

onKeyStroke('k', (e) => {
  e.preventDefault();

  if (!e.ctrlKey && !e.metaKey) {
    return;
  }

  commandPaletteStore.toggleCommandPalette();
});

const commandSections = computed(() => [
  {
    title: 'Tools',
    items: [
      ...tools.map(tool => ({
        label: tool.title,
        icon: tool.icon,
        action: () => navigateTo(tool.path),
      })),
    ],
  },
]);

function handleSelectCommand({ item }: { item: { label: string; action: () => void; keepOpen?: boolean } }) {
  item.action();

  if (!item.keepOpen) {
    commandPaletteStore.closeCommandPalette();
  }
}
</script>

<template>
  <CommandDialog v-model:open="commandPaletteStore.isCommandPaletteOpen">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>{{ $t('command-palette.no-result') }}</CommandEmpty>
      <!-- <CommandGroup heading="Suggestions">
        <CommandItem value="calendar">
          Calendar
        </CommandItem>
        <CommandItem value="search-emoji">
          Search Emoji
        </CommandItem>
        <CommandItem value="calculator">
          Calculator
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem value="profile">
          Profile
        </CommandItem>
        <CommandItem value="billing">
          Billing
        </CommandItem>
        <CommandItem value="settings">
          Settings
        </CommandItem>
      </CommandGroup> -->
      <CommandGroup v-for="section in commandSections" :key="section.title" :heading="section.title">
        <CommandItem v-for="item in section.items" :key="item.label" :value="item.label" @select="handleSelectCommand({ item })">
          <Icon :name="item.icon" class="mr-2 size-4" />
          {{ item.label }}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
