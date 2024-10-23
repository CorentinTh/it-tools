import { Code } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Code/Scripts Highlighter',
  path: '/code-highlighter',
  description: 'Highlight programming code fragments',
  keywords: ['code', 'highlighter'],
  component: () => import('./code-highlighter.vue'),
  icon: Code,
  createdAt: new Date('2024-08-15'),
});
