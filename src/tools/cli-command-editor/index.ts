import { Terminal2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CLI command editor',
  path: '/cli-command-editor',
  description: '',
  keywords: ['cli', 'command', 'editor'],
  component: () => import('./cli-command-editor.vue'),
  icon: Terminal2,
  createdAt: new Date('2025-06-21'),
});
