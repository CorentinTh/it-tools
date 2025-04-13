import { IconMessages } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Ai prompt splitter',
  path: '/ai-prompt-splitter',
  description: '',
  keywords: ['ai', 'prompt', 'splitter'],
  component: () => import('./ai-prompt-splitter.vue'),
  icon: IconMessages,
  createdAt: new Date('2024-10-18'),
});
