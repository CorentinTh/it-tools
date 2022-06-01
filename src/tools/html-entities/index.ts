import { Code } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Escape html entities',
  path: '/html-entities',
  description: 'Escape or unescape html entities (replace <,>, &, " and \' to their html version)',
  keywords: ['html', 'entities', 'escape', 'unescape', 'special', 'characters', 'tags'],
  component: () => import('./html-entities.vue'),
  icon: Code,
});
