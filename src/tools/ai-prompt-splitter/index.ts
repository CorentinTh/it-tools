import { Prompt } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'AI Prompt Splitter',
  path: '/ai-prompt-splitter',
  description: 'Split a long document to multiple chat (ie ChatGPT) priompts',
  keywords: ['ai', 'chatgpt', 'gpt', 'prompt', 'splitter'],
  component: () => import('./ai-prompt-splitter.vue'),
  icon: Prompt,
  createdAt: new Date('2024-07-14'),
});
