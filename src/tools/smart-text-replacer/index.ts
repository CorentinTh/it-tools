import { Search } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Smart Text Replacer and Linebreaker',
  path: '/smart-text-replacer',
  description: 'Search and replace a word on single or multiple occurrences just like windows notepad search and replace. Also allows to manage linebreaking and text splitting',
  keywords: ['smart', 'text-replacer', 'linebreak', 'remove', 'add', 'split', 'search', 'replace'],
  component: () => import('./smart-text-replacer.vue'),
  icon: Search,
  createdAt: new Date('2024-04-03'),
});
