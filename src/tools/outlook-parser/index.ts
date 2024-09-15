import { Mail } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Outlook MSG Parser',
  path: '/outlook-parser',
  description: 'Parse Outlook MSG Files',
  keywords: ['outlook', 'email', 'msg', 'parser'],
  component: () => import('./outlook-parser.vue'),
  icon: Mail,
  createdAt: new Date('2024-08-15'),
});
