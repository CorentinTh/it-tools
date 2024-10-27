import { IconMarkdown } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown to HTML',
  path: '/markdown-to-html',
  description: 'Convert Markdown to Html and allow to print (as PDF)',
  keywords: ['markdown', 'html', 'converter', 'pdf'],
  component: () => import('./markdown-to-html.vue'),
  icon: IconMarkdown,
  createdAt: new Date('2024-08-25'),
});
