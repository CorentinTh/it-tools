import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown viewer',
  path: '/markdown-viewer',
  description: 'Effortlessly view Markdown files with enhanced readability and convenience',
  keywords: ['markdown', 'viewer'],
  component: () => import('./markdown-viewer.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2023-12-02'),
});
