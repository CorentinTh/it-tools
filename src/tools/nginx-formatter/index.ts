import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Nginx formatter',
  path: '/nginx-formatter',
  description: 'Format/prettify Nginx configuration files',
  keywords: ['nginx', 'formatter', 'prettier'],
  component: () => import('./nginx-formatter.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-30'),
});
