import { Code } from '@vicons/tabler';
import type { ITool } from './../Tool';

export const tool: ITool = {
  name: 'Escape html entities',
  path: '/html-entities',
  description: 'Escape or unescape html entities (replace <,>, &, " and \' to their html version)',
  keywords: ['html', 'entities', 'escape', 'unescape', 'special', 'characters', 'tags'],
  component: () => import('./html-entities.vue'),
  icon: Code,
};