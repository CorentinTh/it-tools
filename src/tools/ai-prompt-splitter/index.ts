import { Messages } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Ai prompt splitter',
  path: '/ai-prompt-splitter',
  description: '',
  keywords: ['ai', 'prompt', 'splitter'],
  component: () => import('./ai-prompt-splitter.vue'),
  icon: Messages,
  createdAt: new Date('2024-10-18'),
});
