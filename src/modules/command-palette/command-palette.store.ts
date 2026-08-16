import { defineStore } from 'pinia';
import type { PaletteOption } from './command-palette.types';
import { groupPaletteOptions, rankPaletteOptions } from './command-palette.search';
import { useToolStore } from '@/tools/tools.store';
import { useStyleStore } from '@/stores/style.store';

import SunIcon from '~icons/mdi/white-balance-sunny';
import GithubIcon from '~icons/mdi/github';
import BugIcon from '~icons/mdi/bug-outline';
import DiceIcon from '~icons/mdi/dice-5';
import InfoIcon from '~icons/mdi/information-outline';

export const useCommandPaletteStore = defineStore('command-palette', () => {
  const toolStore = useToolStore();
  const styleStore = useStyleStore();
  const router = useRouter();
  const searchPrompt = ref('');
  const showAllResults = ref(false);

  const toolsOptions = computed(() => toolStore.tools.map(tool => ({
    ...tool,
    to: tool.path,
    toolCategory: tool.category,
    category: 'Tools',
  })));

  const searchOptions = computed<PaletteOption[]>(() => [
    ...toolsOptions.value,
    {
      name: 'Random tool',
      description: 'Get a random tool from the list.',
      action: () => {
        const tool = toolStore.tools[Math.floor(Math.random() * toolStore.tools.length)];
        if (tool) {
          router.push(tool.path);
        }
      },
      icon: DiceIcon,
      category: 'Tools',
      keywords: ['random', 'tool', 'pick', 'choose', 'select'],
      closeOnSelect: true,
    },
    {
      name: 'Toggle dark mode',
      description: 'Toggle dark mode on or off.',
      action: () => styleStore.toggleDark(),
      icon: SunIcon,
      category: 'Actions',
      keywords: ['dark', 'theme', 'toggle', 'mode', 'light', 'system'],
    },
    {
      name: 'Github repository',
      href: 'https://github.com/CorentinTh/it-tools',
      category: 'External',
      description: 'View the source code of it-tools on Github.',
      keywords: ['github', 'repo', 'repository', 'source', 'code'],
      icon: GithubIcon,
    },
    {
      name: 'Report a bug or an issue',
      description: 'Report a bug or an issue to help improve it-tools.',
      href: 'https://github.com/CorentinTh/it-tools/issues/new/choose',
      category: 'Actions',
      keywords: ['report', 'issue', 'bug', 'problem', 'error'],
      icon: BugIcon,
    },
    {
      name: 'About',
      description: 'Learn more about IT-Tools.',
      to: '/about',
      category: 'Pages',
      keywords: ['about', 'learn', 'more', 'info', 'information'],
      icon: InfoIcon,
    },
  ]);

  const searchResult = computed(() => rankPaletteOptions(searchOptions.value, searchPrompt.value));
  const hiddenResultCount = computed(() => searchResult.value.length
    - Object.values(groupPaletteOptions(searchResult.value, 5)).flat().length);

  const filteredSearchResult = computed(() => groupPaletteOptions(searchResult.value, showAllResults.value ? undefined : 5));

  return {
    filteredSearchResult,
    hiddenResultCount,
    searchPrompt,
    showAllResults,
  };
});
