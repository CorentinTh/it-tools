import { Edit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Unicode Formatter',
  path: '/unicode-formatter',
  description: 'Format text using Unicode fonts',
  keywords: ['unicode', 'formatter', 'fonts'],
  component: () => import('./unicode-formatter.vue'),
  icon: Edit,
  createdAt: new Date('2024-04-07'),
});
