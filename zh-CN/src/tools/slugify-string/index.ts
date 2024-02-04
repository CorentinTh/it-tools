import { AbcRound } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Slugify string',
  path: '/slugify-string',
  description: 'Make a string url, filename and id safe.',
  keywords: ['slugify', 'string', 'escape', 'emoji', 'special', 'character', 'space', 'trim'],
  component: () => import('./slugify-string.vue'),
  icon: AbcRound,
});
