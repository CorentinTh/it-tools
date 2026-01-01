import { CodeMinus } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Dead pixel',
  path: '/dead-pixel',
  description:
    'Tool to check if a pixel on your screen is dead or not. Dead pixels are pixels on a liquid crystal display (LCD) that are not functioning properly, resulting in a constant lit or unlit pixel on the screen.',
  keywords: ['dead', 'pixel'],
  component: () => import('./dead-pixel.vue'),
  icon: CodeMinus,
  createdAt: new Date('2026-01-01'),
});
