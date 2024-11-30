import { defineStore } from 'pinia';
import _ from 'lodash';
import { IconBrandGithub, IconBug, IconDice5Filled, IconInfoCircle, IconSun } from '@tabler/icons-vue';
import type { PaletteOption } from './command-palette.types';
import { useToolStore } from '@/tools/tools.store';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import { useStyleStore } from '@/stores/style.store';

export const useCommandPaletteStore = defineStore('command-palette', () => {
  const toolStore = useToolStore();
  const styleStore = useStyleStore();
  const router = useRouter();
  const searchPrompt = ref('');

  const toolsOptions = toolStore.tools.map(tool => ({
    ...tool,
    to: tool.path,
    toolCategory: tool.category,
    category: 'Tools',
  }));

  const searchOptions: PaletteOption[] = [
    ...toolsOptions,
    {
      name: 'Random tool',
      description: 'Get a random tool from the list.',
      action: () => {
        const { path } = _.sample(toolStore.tools)!;
        router.push(path);
      },
      icon: IconDice5Filled,
      category: 'Tools',
      keywords: ['random', 'tool', 'pick', 'choose', 'select'],
      closeOnSelect: true,
    },
    {
      name: 'Toggle dark mode',
      description: 'Toggle dark mode on or off.',
      action: () => styleStore.toggleDark(),
      icon: IconSun,
      category: 'Actions',
      keywords: ['dark', 'theme', 'toggle', 'mode', 'light', 'system'],
    },
    {
      name: 'Github repository',
      href: 'https://github.com/CorentinTh/it-tools',
      category: 'External',
      description: 'View the source code of it-tools on Github.',
      keywords: ['github', 'repo', 'repository', 'source', 'code'],
      icon: IconBrandGithub,
    },
    {
      name: 'Report a bug or an issue',
      description: 'Report a bug or an issue to help improve it-tools.',
      href: 'https://github.com/CorentinTh/it-tools/issues/new/choose',
      category: 'Actions',
      keywords: ['report', 'issue', 'bug', 'problem', 'error'],
      icon: IconBug,
    },
    {
      name: 'About',
      description: 'Learn more about IT-Tools.',
      to: '/about',
      category: 'Pages',
      keywords: ['about', 'learn', 'more', 'info', 'information'],
      icon: IconInfoCircle,
    },
  ];

  const { searchResult } = useFuzzySearch({
    search: searchPrompt,
    data: searchOptions,
    options: {
      keys: [{ name: 'name', weight: 2 }, 'description', 'keywords', 'category'],
      threshold: 0.3,
    },
  });

  const filteredSearchResult = computed(() =>
    _.chain(searchResult.value).groupBy('category').mapValues(categoryOptions => _.take(categoryOptions, 5)).value());

  return {
    filteredSearchResult,
    searchPrompt,
  };
});
