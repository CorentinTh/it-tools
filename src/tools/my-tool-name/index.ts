import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'My tool name',
  path: '/my-tool-name',
  description: '',
  keywords: ['my', 'tool', 'name'],
  component: () => import('./my-tool-name.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-05-31'),
});